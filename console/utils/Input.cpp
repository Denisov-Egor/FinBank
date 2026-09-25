#include "Input.h"

#include <iostream>
#include <limits>

std::string inputFullName()
{
    std::string fullName;

    std::cout << "Введите ФИО: ";
    std::getline(std::cin, fullName);

    while (true)
    {
        if (fullName.empty())
        {
            std::cout << "ФИО не может быть пустым.\n";
            std::cout << "Введите ФИО еще раз: ";

            std::getline(std::cin, fullName);
        }
        else
        {
            break;
        }
    }

    return fullName;
}

int inputAge()
{
    int age;

    while (true)
    {
        std::cout << "Введите возраст: ";
        std::cin >> age;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(), '\n');

            std::cout << "Ошибка: возраст должен быть числом.\n";
            continue;
        }

        if (age < 18)
        {
            std::cout << "Ваш возраст не может быть меньше 18.\n";
            continue;
        }

        break;
    }

    std::cin.ignore();

    return age;
}

std::string inputPhone()
{
    std::string phone;

    std::cout << "Введите телефон: ";
    std::getline(std::cin, phone);

    while (true)
    {
        if (phone.empty())
        {
            std::cout << "Номер телефона не может быть пустым.\n";
            std::cout << "Введите номер телефона еще раз: ";

            std::getline(std::cin, phone);
        }
        else
        {
            break;
        }
    }

    return phone;
}

std::string inputEmail()
{
    std::string email;

    std::cout << "Введите Email: ";
    std::getline(std::cin, email);

    while (true)
    {
        if (email.empty())
        {
            std::cout << "Почта не может быть пустой.\n";
            std::cout << "Введите почту еще раз: ";

            std::getline(std::cin, email);
        }
        else
        {
            break;
        }
    }

    return email;
}
