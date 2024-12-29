import Cookies from "js-cookie";

type Language = 'en' | 'cn' | 'ua'; // Добавьте другие языки, если нужно

export const getLanguage = (): Language => {
    const language = Cookies.get('language') as Language;
    return language || 'en'; // Если язык не найден в куки, возвращаем 'en' по умолчанию
};

// Функция для установки языка в куки
export const setLanguage = (lang: Language): void => {
    Cookies.set('language', lang, { expires: 1 }); // Сохраняем язык на 365 дней
};
