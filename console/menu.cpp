#include <iostream>
#include <string>
#include <limits>
#include <vector>

#include "menu.h"

std::vector<Account> accounts;
std::vector<Operation> operations;

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

void showAccounts()
{
  std::cin.ignore();
 
  Account account;

  std::cout << "Введите номер счета: ";
  std::getline(std::cin, account.accountNumber);

  std::cout << "Введите тип счёта: ";
  std::getline(std::cin, account.accountType);

  std::cout << "Введите валюту: ";
  std::getline(std::cin, account.currency);

  while (true)
  {
    std::cout << "Введите баланс: ";
    std::cin >> account.balance;

    if (std::cin.fail())
    {
      std::cin.clear();
      std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(), '\n'
      );

      std::cout << "Ошибка: баланс должен быть числом.\n";
      continue;
    }

    if (account.balance < 0)
    {
      std::cout << "Ошибка: баланс не может быть меньше 0.\n";
      continue;
    }

    break;
  }

  std::cin.ignore();

  std::cout << "Введите статус счёта: ";
  std::getline(std::cin, account.status);

  accounts.push_back(account);

}

void accountMenu()
{
  int choice;

  do
  {
    std::cout << 
    R"(
      ========================
      МОИ СЧЕТА
      ========================
      
      1. Создать счёт
      2. Показать счета
      3. Выбрать счёт
      4. Вернуться
      
      ========================
      Выберите действие:
      )";
      
    std::cin >> choice;

    switch (choice)
    {
    case 1:
      showAccounts();
      break;
    
    case 2:
      displayAccounts();
      break;

    case 3:
      selectAccount();
      break;

    case 4:
      std::cout << "Возврат в главное меню.\n";
      break;
    
    default:
     std::cout << "Неверный пункт меню.\n";
      break;
    }
  } while (choice != 4);
  
}

void displayAccounts()
{
  std::cout << "\n===== МОИ СЧЕТА =====\n";

  if (accounts.empty())
  {
    std::cout << "У вас нет открытых счетов.\n";
    return;
  }

  for (const Account& account : accounts)
  {
    std::cout << "\nНомер: " << account.accountNumber << "\n";
    std::cout << "Тип: " << account.accountType << "\n";
    std::cout << "Валюта: " << account.currency << "\n";
    std::cout << "Баланс: " << account.balance << "\n";
    std::cout << "Статус: " << account.status << "\n";
  }
}

void selectAccount()
{
  int choice;

  if (accounts.empty())
  {
    std::cout << "У вас нет открытых счетов.";
    return;
  }

  for (int i = 0; i < accounts.size(); i++)
  {
    std::cout << i + 1 << ". ";
    std::cout << accounts[i].accountNumber << "\n";
  }
  
  std::cout << "Выберите счёт: ";
  std::cin >> choice;

  if (choice < 1 || choice > accounts.size())
  {
    std::cout << "Неверный номер счёта.\n";
    return;
  }

  int index = choice - 1;

  std::cout << "\n===== ВЫБРАННЫЙ СЧЁТ =====\n"; 
  std::cout << "Номер: " << accounts[index].accountNumber << "\n"; 
  std::cout << "Тип: " << accounts[index].accountType << "\n"; 
  std::cout << "Валюта: " << accounts[index].currency << "\n"; 
  std::cout << "Баланс: " << accounts[index].balance << "\n"; 
  std::cout << "Статус: " << accounts[index].status << "\n";
  
  selectedAccountMenu(index);
}

void selectedAccountMenu(int index)
{
  int choice;

  do
  {
    std::cout <<
    R"(
    ===== МОЙ СЧЁТ =====
  
    1. Просмотреть счёт
    2. Пополнить
    3. Снять деньги
    4. Назад
  
    Выберите действие:
    )";

    std::cin >> choice;

    switch (choice)
    {
    case 1:
      std::cout << "\n===== ИНФОРМАЦИЯ О СЧЁТЕ =====\n";
      std::cout << "Номер: " << accounts[index].accountNumber << "\n";
      std::cout << "Тип: " << accounts[index].accountType << "\n";
      std::cout << "Валюта: " << accounts[index].currency << "\n";
      std::cout << "Баланс: " << accounts[index].balance << "\n";
      std::cout << "Статус: " << accounts[index].status << "\n";
      break;

    case 2:
    {
      double amount;

      std::cout << "Введите сумму пополнения: ";
      std::cin >> amount;

      if (std::cin.fail())
      {
        std::cin.clear();
        std::cin.ignore(
          std::numeric_limits<std::streamsize>::max(), '\n'
        );

        std::cout << "Ошибка: сумма должна быть числом.\n";
        break;
      }

      if (amount <= 0)
      {
        std::cout << "Ошибка: сумма пополнения должна быть больше 0.\n";
        break;
      }

      accounts[index].balance += amount;

     Operation operation;

      operation.type = "Пополнение";
      operation.accountNumber = accounts[index].accountNumber;
      operation.amount = amount;
      operation.description = "Пополнение банковского счёта";

      operations.push_back(operation);
      break;
    }

    case 3:
    {
      double amount;

      std::cout << "Введите сумму снятия: ";
      std::cin >> amount;

      if (std::cin.fail())
      {
        std::cin.clear();
        std::cin.ignore(
          std::numeric_limits<std::streamsize>::max(), '\n'
        );

        std::cout << "Ошибка: сумма должна быть числом.\n";
        break;
      }

      if (amount <= 0)
      {
        std::cout << "Ошибка: сумма снятия должна быть больше 0.\n";
        break;
      }

      if (amount > accounts[index].balance)
      {
        std::cout << "Ошибка: недостаточно средств на счёте.\n";
        std::cout << "Текущий баланс: "
                  << accounts[index].balance << "\n";
        break;
      }

      accounts[index].balance -= amount;

      Operation operation;

      operation.type = "Снятие";
      operation.accountNumber = accounts[index].accountNumber;
      operation.amount = amount;
      operation.description = "Снятие денежных средств";

      operations.push_back(operation);

      std::cout << "Деньги успешно сняты.\n";
      std::cout << "Новый баланс: " << accounts[index].balance << "\n";
      break;
    }

    case 4:
      std::cout << "Возврат.\n";
      break;
    
    default:
      std::cout << "Неверный пункт меню.\n";
      break;
    }
  } while (choice != 4);
  
}

void transferMoney()
{
  int senderChoice;
  int receiverChoice;
  double amount;

  if (accounts.size() < 2)
  {
    std::cout << "\nДля перевода необходимо иметь минимум два счёта.\n";
    return;
  }

  std::cout << "\n===== ПЕРЕВОД ДЕНЕЖНЫХ СРЕДСТВ =====\n";

  std::cout << "\nДоступные счета:\n";

  for (int i = 0; i < accounts.size(); i++)
  {
    std::cout << i + 1 << ". "
              << accounts[i].accountNumber
              << " | Баланс: "
              << accounts[i].balance
              << " "
              << accounts[i].currency
              << "\n";
  }

  std::cout << "\nВыберите счёт отправителя: ";
  std::cin >> senderChoice;

  if (senderChoice < 1 || senderChoice > accounts.size())
  {
    std::cout << "Ошибка: неверный счёт отправителя.\n";
    return;
  }

  std::cout << "Выберите счёт получателя: ";
  std::cin >> receiverChoice;

  if (receiverChoice < 1 || receiverChoice > accounts.size())
  {
    std::cout << "Ошибка: неверный счёт получателя.\n";
    return;
  }

  if (senderChoice == receiverChoice)
  {
    std::cout << "Ошибка: нельзя переводить деньги на тот же счёт.\n";
    return;
  }

  std::cout << "Введите сумму перевода: ";
  std::cin >> amount;

  if (std::cin.fail())
  {
    std::cin.clear();
    std::cin.ignore(
      std::numeric_limits<std::streamsize>::max(), '\n'
    );

    std::cout << "Ошибка: сумма должна быть числом.\n";
    return;
  }

  if (amount <= 0)
  {
    std::cout << "Ошибка: сумма перевода должна быть больше 0.\n";
    return;
  }

  int senderIndex = senderChoice - 1;
  int receiverIndex = receiverChoice - 1;

  if (amount > accounts[senderIndex].balance)
  {
    std::cout << "Ошибка: недостаточно средств на счёте отправителя.\n";
    std::cout << "Текущий баланс: "
              << accounts[senderIndex].balance
              << "\n";
    return;
  }

  accounts[senderIndex].balance -= amount;
  accounts[receiverIndex].balance += amount;

  Operation operation;

  operation.type = "Перевод";
  operation.accountNumber = accounts[senderIndex].accountNumber;
  operation.amount = amount;
  operation.description = "Перевод на счёт " + accounts[receiverIndex].accountNumber;

  operations.push_back(operation);

  std::cout << "\nПеревод успешно выполнен.\n";

  std::cout << "Счёт отправителя: "
            << accounts[senderIndex].accountNumber
            << "\n";

  std::cout << "Счёт получателя: "
            << accounts[receiverIndex].accountNumber
            << "\n";

  std::cout << "Сумма перевода: "
            << amount
            << "\n";

  std::cout << "Новый баланс отправителя: "
            << accounts[senderIndex].balance
            << "\n";

  std::cout << "Новый баланс получателя: "
            << accounts[receiverIndex].balance
            << "\n";
}

void showOperationHistory()
{
  std::cout << "\n===== ИСТОРИЯ ОПЕРАЦИЙ =====\n";

  if (operations.empty())
  {
  std::cout << "История операций пуста.\n";
  return;
  }

  for (int i = 0; i < operations.size(); i++)
  {
  std::cout << "\nОперация №" << i + 1 << "\n";
  std::cout << "Тип: "
  << operations[i].type
  << "\n";

  std::cout << "Счёт: " << operations[i].accountNumber << "\n";

  std::cout << "Сумма: " << operations[i].amount << "\n";

  std::cout << "Описание: " << operations[i].description << "\n";

  std::cout << "------------------------\n";
  }
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
        accountMenu();
        break;

      case 3:
        std::cout << "Открываем раздел «Вклады».\n";
        break;

      case 4:
        std::cout << "Открываем раздел «Кредиты».\n";
        break;

      case 5:
        transferMoney();
        break;

      case 6:
        showOperationHistory();
        break;

      case 7:
        std::cout << "Выход.\n";
        break;

    }

  } while (choice != 7);
}
