use display_interface_spi::SPIInterface;
use embedded_graphics::geometry::{Point, Size};
use embedded_graphics::mono_font::ascii::FONT_10X20;
use embedded_graphics::mono_font::MonoTextStyle;
use embedded_graphics::text::{Alignment, Text};
use embedded_graphics::{
    pixelcolor::Rgb565,
    pixelcolor::RgbColor,
    prelude::*,
    primitives::{PrimitiveStyleBuilder, Rectangle},
};
use esp_idf_hal::delay::Ets;
use esp_idf_hal::gpio::{AnyInputPin, AnyOutputPin, PinDriver, Pull};
use esp_idf_hal::spi::SpiDriver;
use esp_idf_hal::spi::{self, *};
use esp_idf_hal::units::Hertz;
use mipidsi::options::ColorInversion;
use mipidsi::{models, Builder, Display};

use esp_idf_hal::{delay::FreeRtos, peripherals::Peripherals};
use esp_idf_sys::*;
use rand::Rng;

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

    let style = PrimitiveStyleBuilder::new()
        .stroke_color(Rgb565::RED)
        .stroke_width(3)
        .fill_color(Rgb565::GREEN)
        .build();

    Rectangle::new(Point::new(20, 20), Size::new(200, 200))
        .into_styled(style)
        .draw(&mut display)
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

    let led_pin = peripherals.pins.gpio9;
    let channel = peripherals.rmt.channel0;

    // start with a random number between and including 0 and 9, small rand
    let mut active_num = rand::thread_rng().gen_range(0..10);
    let mut pin_progress = 0;

    let mut should_update_unlock_screen = true;

    loop {
        // check button 1
        if button1.is_low() {
            log::info!("[keypress] btn 1");
            active_num = if active_num == 9 {
                0
            } else {
                active_num + 1
            };
            should_update_unlock_screen = true;
        }
        if button2.is_low() {
            log::info!("[keypress] btn 2");
        }
        if button3.is_low() {
            log::info!("[keypress] btn 3");
        }
        if button4.is_low() {
            log::info!("[keypress] btn 4");
            // decrease active_num by 1, if below 0, add 10 to active_num
            active_num = if active_num == 0 {
                9
            } else {
                active_num - 1
            };
            should_update_unlock_screen = true;
        }
        // ws2812.write_nocopy(pixels).unwrap();

        if should_update_unlock_screen {
            draw_unlock_screen(&mut display, &active_num, &pin_progress);
            should_update_unlock_screen = false;
        }

        FreeRtos::delay_ms(100);
    }
}

fn draw_unlock_screen<'a>(
    display: &mut Display<
        SPIInterface<
            SpiDeviceDriver<'a, SpiDriver<'a>>,
            PinDriver<esp_idf_hal::gpio::Gpio4, esp_idf_hal::gpio::InputOutput>,
        >,
        models::ST7789,
        PinDriver<esp_idf_hal::gpio::Gpio5, esp_idf_hal::gpio::InputOutput>,
    >,
    active_num: &u8,
    pin_progress: &u8,
) {
    display.clear(Rgb565::new(253, 238, 198)).unwrap();

    let style = PrimitiveStyleBuilder::new()
        .stroke_width(1)
        .fill_color(Rgb565::new(231, 217, 154))
        .build();

    Rectangle::new(Point::new(0, 180), Size::new(240, 60))
        .into_styled(style)
        .draw(display)
        .unwrap();

    let style = MonoTextStyle::new(&FONT_10X20, Rgb565::BLACK);
    let mut text = Text::new("Unlock Device", Point::new(120, 80), style);
    text.text_style.alignment = Alignment::Center;
    text.draw(display).unwrap();

    let active_num_str = format!("{}", active_num);
    let mut active_num_txt = Text::new(&active_num_str, Point::new(120, 180), style);
    active_num_txt.text_style.alignment = Alignment::Center;
    active_num_txt.draw(display).unwrap();

    // iterate -5 and +5 and print the numbers
    for i in -5i8..=5 {
        if i == 0 {
            continue;
        }
        // map i to the range 0-9
        let current_num: i32 = {
            let mut current_num = *active_num as i8 + i;
            if current_num < 0 {
                current_num += 10;
            }
            current_num % 10
        }
        .into();

        let current_num_str = format!("{}", current_num);
        // multiply i by 5 to get the x position
        let current_num_x: i32 = 120 + (i as i32 * 15);
        let mut current_num_txt =
            Text::new(&current_num_str, Point::new(current_num_x, 180), style);
        current_num_txt.text_style.alignment = Alignment::Center;
        current_num_txt.draw(display).unwrap();
    }
}
