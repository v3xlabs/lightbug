use display_interface_spi::SPIInterface;
use embedded_graphics::geometry::{Point, Size};
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
use mipidsi::{models, Builder};

use esp_idf_hal::{delay::FreeRtos, peripherals::Peripherals};
use esp_idf_sys::*;
use smart_leds::colors::{GREEN, RED};
use smart_leds::hsv::{hsv2rgb, Hsv};
use smart_leds::RGB;
use ws2812_esp32_rmt_driver::Ws2812Esp32Rmt;

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
        dma: Dma::Auto(8),
        ..Default::default()
    };

    let spi = SpiDriver::new(
        peripherals.spi2,
        peripherals.pins.gpio6, // sclk
        sdo,                    // mosi
        None::<AnyInputPin>,    // miso
        &driver_config,
    )?;

    let config = spi::SpiConfig {
        data_mode: embedded_hal::spi::MODE_3,
        baudrate: Hertz(40_000_000),
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

    loop {
        // check button 1
        if button1.is_low() {
            log::info!("[keypress] btn 1");
        }
        if button2.is_low() {
            log::info!("[keypress] btn 2");
        }
        if button3.is_low() {
            log::info!("[keypress] btn 3");
        }
        if button4.is_low() {
            log::info!("[keypress] btn 4");
        }
        // ws2812.write_nocopy(pixels).unwrap();

        FreeRtos::delay_ms(100);
    }
}
