#include <iostream>
#include <string>
#include <limits>

#include "menu.h"

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
    }else
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
      std::numeric_limits<std::streamsize>::max(),'\n');

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
    }else
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
    }else
    {
      break;
    }  
  }

  return email;
}

void showProfile(
  const std::string& fullName,
  int age,
  const std::string& phone,
  const std::string& email
)
{
  std::cout << "\n===== ПРОФИЛЬ =====\n";
  std::cout << "ФИО: " << fullName << "\n";
  std::cout << "Возраст: " << age << "\n";
  std::cout << "Телефон: " << phone << "\n";
  std::cout << "Email: " << email << "\n";
}

void showMenu(
  const std::string& fullName,
  int age,
  const std::string& phone,
  const std::string& email
)
{
  int choice;

  do
  {
    std::cout <<
    R"(
    ========================
          ГЛАВНОЕ МЕНЮ
    ========================

    1. Мой профиль
    2. Мои счета
    3. Вклады
    4. Кредиты
    5. Переводы
    6. История операций
    7. Выход

    ========================
    Выберите действие: )";

    std::cin >> choice;

    if (std::cin.fail())
    {
      std::cin.clear();
      std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(), '\n'
      );

      std::cout << "Ошибка: необходимо ввести число от 1 до 7.\n";
      continue;
    }

    if (choice < 1 || choice > 7)
    {
      std::cout << "Неверный пункт меню. Выберите число от 1 до 7.\n";
      continue;
    }

    switch (choice)
    {
      case 1:
        showProfile(fullName, age, phone, email);
        break;

      case 2:
        std::cout << "Открываем раздел «Мои счета».\n";
        break;

      case 3:
        std::cout << "Открываем раздел «Вклады».\n";
        break;

      case 4:
        std::cout << "Открываем раздел «Кредиты».\n";
        break;

      case 5:
        std::cout << "Открываем раздел «Переводы».\n";
        break;

      case 6:
        std::cout << "Открываем раздел «История операций».\n";
        break;

      case 7:
        std::cout << "Выход.\n";
        break;

    }

  } while (choice != 7);
}
