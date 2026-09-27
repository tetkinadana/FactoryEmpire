import asyncio

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

TOKEN = "8393868474:AAG1FovHe6aY7nHcCn2Wnwep_wc-676eqEA"

dp = Dispatcher()

@dp.message(CommandStart())
async def start(message):
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 ИГРАТЬ",
                    callback_data="play"
                )
            ]
        ]
    )

    await message.answer(
        "🏭 Добро пожаловать в Factory Empire!\n\n"
        "Твоя промышленная империя начинается здесь.",
        reply_markup=keyboard
    )

async def main():
    bot = Bot(token=TOKEN)

    print("🤖 Бот запущен!")

    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())