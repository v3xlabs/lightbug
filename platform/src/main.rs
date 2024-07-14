use display_interface_spi::SPIInterface;
use embedded_graphics::geometry::{Point, Size};
use embedded_graphics::image::{Image, ImageRaw, ImageRawLE};
use embedded_graphics::mono_font::ascii::FONT_10X20;
use embedded_graphics::mono_font::MonoTextStyle;
use embedded_graphics::pixelcolor::raw::{BigEndian, LittleEndian};
use embedded_graphics::pixelcolor::BinaryColor;
use embedded_graphics::primitives::StyledDrawable;
use embedded_graphics::text::{Alignment, Text};
use embedded_graphics::{
    pixelcolor::Rgb565,
    pixelcolor::RgbColor,
    prelude::*,
    primitives::{PrimitiveStyleBuilder, Rectangle},
};
use embedded_svc::ws;
use esp_idf_hal::delay::Ets;
use esp_idf_hal::gpio::{AnyInputPin, AnyOutputPin, PinDriver, Pull};
use esp_idf_hal::spi::SpiDriver;
use esp_idf_hal::spi::{self, *};
use esp_idf_hal::units::Hertz;
use mipidsi::options::ColorInversion;
use mipidsi::{models, Builder, Display};

use esp_idf_hal::{delay::FreeRtos, peripherals::Peripherals};
use esp_idf_sys::*;
use profont::PROFONT_18_POINT as ProFont18Point;
use profont::PROFONT_24_POINT as ProFont24Point;
use qrcode_generator::QrCodeEcc;
use rand::Rng;
use smart_leds::hsv::{hsv2rgb, Hsv};
use smart_leds::RGB8;
use ws2812_esp32_rmt_driver::{Ws2812Esp32Rmt, Ws2812Esp32RmtDriver, RGBW8};

/**
 * Pin Mapping
 * gpio9 LEDs
 * spi2 - bus 2
 * gpio4 - data control (display)
 * gpio5 - display reset (display)
 *
 * the device has 4 individually addressable leds in a row on pin 9
 */

fn main() -> Result<(), EspError> {
    esp_idf_svc::sys::link_patches();
    esp_idf_svc::log::EspLogger::initialize_default();

    log::info!("Booting... this is your .5 seconds to unbrick the device Kappa");

    // Important, do not remove, prevents device bricking
    FreeRtos::delay_ms(500);

    // Grab peripherals
    let peripherals = Peripherals::take().unwrap();

    // Either doesnt matter
    // let mut delay = Delay::new_default();
    let mut delay = Ets;
    // let mut delay = FreeRtos;            // FreeRTOS delay
    let dc = PinDriver::input_output(peripherals.pins.gpio4).unwrap();
    let rst = PinDriver::input_output(peripherals.pins.gpio5).unwrap();
    let sdo = peripherals.pins.gpio7;

    let driver_config = spi::SpiDriverConfig {
        dma: Dma::Auto(1024),
        ..Default::default()
    };

    let spi = SpiDriver::new(
        peripherals.spi2,
        peripherals.pins.gpio6,
        sdo,
        None::<AnyInputPin>,
        &driver_config,
    )?;

    let config = spi::SpiConfig {
        data_mode: embedded_hal::spi::MODE_3,
        baudrate: Hertz(80_000_000),
        ..Default::default()
    };

    let spi = SpiDeviceDriver::new(spi, None::<AnyOutputPin>, &config)?;

    let di = SPIInterface::new(spi, dc);

    let mut display = Builder::new(models::ST7789, di)
        .reset_pin(rst)
        .invert_colors(ColorInversion::Inverted)
        .init(&mut delay)
        .unwrap();

    display.clear(Rgb565::CSS_HOT_PINK).unwrap();

    let mut button1 = PinDriver::input(peripherals.pins.gpio10).unwrap();
    button1.set_pull(Pull::Up).unwrap();

    let mut button2 = PinDriver::input(peripherals.pins.gpio8).unwrap();
    button2.set_pull(Pull::Up).unwrap();

    let mut button3 = PinDriver::input(peripherals.pins.gpio3).unwrap();
    button3.set_pull(Pull::Up).unwrap();

    let mut button4 = PinDriver::input(peripherals.pins.gpio2).unwrap();
    button4.set_pull(Pull::Up).unwrap();

    if button1.is_low() {
        loop {
            FreeRtos::delay_ms(100);
        }
    }

    // start with a random number between and including 0 and 9, small rand
    let mut active_num = rand::thread_rng().gen_range(0..10);
    let mut pin = Vec::<u8>::new();

    let mut should_update_unlock_screen = true;

    let led_pin = peripherals.pins.gpio9;
    let channel = peripherals.rmt.channel0;
    let mut ws2812 = Ws2812Esp32Rmt::new(channel, led_pin).unwrap();

    draw_qr(&mut display);

    loop {
        // check button 1
        if button1.is_low() && button4.is_low() {
            // confirm
            pin.push(active_num);
            should_update_unlock_screen = true;
        } else {
            if button1.is_low() {
                log::info!("[keypress] btn 1");
                active_num = if active_num == 9 { 0 } else { active_num + 1 };
                should_update_unlock_screen = true;
            }
            if button2.is_low() {
                log::info!("[keypress] btn 2");
            }
            if button3.is_low() {
                log::info!("[keypress] btn 3");
                draw_qr(&mut display)
            }
            if button4.is_low() {
                log::info!("[keypress] btn 4");
                // decrease active_num by 1, if below 0, add 10 to active_num
                active_num = if active_num == 0 { 9 } else { active_num - 1 };
                should_update_unlock_screen = true;
            }
        }

        if should_update_unlock_screen {
            draw_unlock_screen(
                &mut display,
                &mut ws2812,
                &active_num,
                &pin.len().try_into().unwrap(),
            );
            should_update_unlock_screen = false;
        }

        FreeRtos::delay_ms(100);
    }
}

fn draw_qr<'a>(
    display: &mut Display<
        SPIInterface<
            SpiDeviceDriver<'a, SpiDriver<'a>>,
            PinDriver<esp_idf_hal::gpio::Gpio4, esp_idf_hal::gpio::InputOutput>,
        >,
        models::ST7789,
        PinDriver<esp_idf_hal::gpio::Gpio5, esp_idf_hal::gpio::InputOutput>,
    >,
) {
    let result1: Vec<Vec<bool>> =
        qrcode_generator::to_matrix("https://v3x.fyi/s1", QrCodeEcc::High).unwrap();

    println!("result1: {:?}, {}", result1.len(), result1[0].len());

    // convert the 2d result to a 1d array, and map true to red and false to black
    let result = result1
        .iter()
        .flat_map(|row| {
            row.iter()
                .map(|pixel| if *pixel { 0b0101_0000 } else { 0b11101111 })
        })
        .collect::<Vec<u8>>();

    println!("result: {:?}", result);

    let raw = ImageRaw::<Rgb565, BigEndian>::new(&result, result1.len() as u32);
    let image = Image::new(&raw, Point::new(50, 50));
    image.draw(display).unwrap();
}
    //     let result: Vec<Vec<bool>> =
fn draw_unlock_screen<'a>(
    display: &mut Display<
        SPIInterface<
            SpiDeviceDriver<'a, SpiDriver<'a>>,
            PinDriver<esp_idf_hal::gpio::Gpio4, esp_idf_hal::gpio::InputOutput>,
        >,
        models::ST7789,
        PinDriver<esp_idf_hal::gpio::Gpio5, esp_idf_hal::gpio::InputOutput>,
    >,
    ws2812: &mut Ws2812Esp32Rmt,
    active_num: &u8,
    pin_progress: &u8,
) {
    //     if *pin_progress >= 4 {
    //         draw_unlocked_screen(display, ws2812);
    //         return;
    //     }

    //     display.clear(Rgb565::new(253, 238, 198)).unwrap();

    //     let style = PrimitiveStyleBuilder::new()
    //         .stroke_width(1)
    //         .fill_color(Rgb565::new(231, 217, 4))
    //         .build();

    //     Rectangle::new(Point::new(0, 210), Size::new(240, 30))
    //         .into_styled(style)
    //         .draw(display)
    //         .unwrap();

    //     let style = MonoTextStyle::new(&ProFont24Point, Rgb565::BLACK);
    //     let mut text = Text::new("Unlock Device", Point::new(120, 80), style);
    //     text.text_style.alignment = Alignment::Center;
    //     text.draw(display).unwrap();

    //     let rect_style = PrimitiveStyleBuilder::new()
    //         .stroke_width(1)
    //         .stroke_color(Rgb565::BLACK)
    //         .fill_color(Rgb565::BLACK)
    //         .build();
    //     Rectangle::new(Point::new(108, 200), Size::new(24, 40))
    //         .draw_styled(&rect_style, display)
    //         .unwrap();

    //     let active_style = MonoTextStyle::new(&ProFont24Point, Rgb565::WHITE);
    //     let active_num_str = format!("{}", active_num);
    //     let mut active_num_txt = Text::new(&active_num_str, Point::new(120, 230), active_style);
    //     active_num_txt.text_style.alignment = Alignment::Center;
    //     active_num_txt.draw(display).unwrap();

    //     let style = MonoTextStyle::new(&ProFont18Point, Rgb565::BLACK);

    //     // iterate -5 and +5 and print the numbers
    //     for i in -5i8..=5 {
    //         if i == 0 {
    //             continue;
    //         }
    //         // map i to the range 0-9
    //         let current_num: i32 = {
    //             let mut current_num = *active_num as i8 + i;
    //             if current_num < 0 {
    //                 current_num += 10;
    //             }
    //             current_num % 10
    //         }
    //         .into();

    //         let current_num_str = format!("{}", current_num);
    //         // multiply i by 5 to get the x position
    //         let current_num_x: i32 = 120 + (i as i32 * 20);
    //         let mut current_num_txt =
    //             Text::new(&current_num_str, Point::new(current_num_x, 230), style);
    //         current_num_txt.text_style.alignment = Alignment::Center;
    //         current_num_txt.draw(display).unwrap();
    //     }

    //     // Draw Code Progress
    //     let code_field_width = 10;
    //     let code_field_height = 24;
    //     let code_field_spacing = 4;

    //     let box_style = PrimitiveStyleBuilder::new()
    //         .fill_color(Rgb565::CSS_GRAY)
    //         .build();
    //     let box_style_2 = PrimitiveStyleBuilder::new()
    //         .fill_color(Rgb565::CSS_WHITE)
    //         .build();
    //     for i in 0..4 {
    //         let x = 120 - 2 * (code_field_width + code_field_spacing)
    //             + (i * (code_field_width + code_field_spacing));
    //         let style = if i < *pin_progress {
    //             &box_style
    //         } else {
    //             &box_style_2
    //         };
    //         Rectangle::new(
    //             Point::new(x as i32, 100),
    //             Size::new(code_field_width.into(), code_field_height),
    //         )
    //         .draw_styled(style, display)
    //         .unwrap();
    //     }

    //     // Update LEDs
    //     let off = hsv2rgb(Hsv {
    //         hue: 0,
    //         sat: 0,
    //         val: 0,
    //     });
    //     let green = hsv2rgb(Hsv {
    //         hue: 120,
    //         sat: 255,
    //         val: 50,
    //     });
    //     // let pixels = vec![green, off, off, green];
    //     // let pixels = std::iter::repeat(green).take(4);
    //     let pixels = vec![green, off, off, green];

    //     ws2812.write_nocopy(pixels).unwrap();
}

fn draw_unlocked_screen<'a>(
    display: &mut Display<
        SPIInterface<
            SpiDeviceDriver<'a, SpiDriver<'a>>,
            PinDriver<esp_idf_hal::gpio::Gpio4, esp_idf_hal::gpio::InputOutput>,
        >,
        models::ST7789,
        PinDriver<esp_idf_hal::gpio::Gpio5, esp_idf_hal::gpio::InputOutput>,
    >,
    ws2812: &mut Ws2812Esp32Rmt,
) {
    //     display.clear(Rgb565::new(253, 238, 198)).unwrap();

    //     let style = MonoTextStyle::new(&ProFont24Point, Rgb565::BLACK);
    //     let mut text = Text::new("Welcome!", Point::new(120, 80), style);
    //     text.text_style.alignment = Alignment::Center;
    //     text.draw(display).unwrap();

    //     // Update LEDs
    //     let off = hsv2rgb(Hsv {
    //         hue: 0,
    //         sat: 0,
    //         val: 0,
    //     });
    //     let green = RGB8::new(0, 255, 0);
    //     let pixels = vec![green, green, green, green];
    //     ws2812.write_nocopy(pixels).unwrap();
}
