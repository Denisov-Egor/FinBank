#include "AccountService.h"

#include <iostream>
#include <limits>

void createAccount(std::vector<Account>& accounts)
{
    std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(), '\n'
    );

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

    std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(), '\n'
    );

    std::cout << "Введите статус счёта: ";
    std::getline(std::cin, account.status);

    accounts.push_back(account);
}

void displayAccounts(const std::vector<Account>& accounts)
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

void selectAccount(
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
)
{
    int choice;

    if (accounts.empty())
    {
        std::cout << "У вас нет открытых счетов.";
        return;
    }

    for (size_t i = 0; i < accounts.size(); i++)
    {
        std::cout << i + 1 << ". ";
        std::cout << accounts[i].accountNumber << "\n";
    }

    std::cout << "Выберите счёт: ";
    std::cin >> choice;

    if (choice < 1 || static_cast<size_t>(choice) > accounts.size())
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

    selectedAccountMenu(index, accounts, operations);
}

void selectedAccountMenu(
    int index,
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
)
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
            std::cout << "Новый баланс: "
                      << accounts[index].balance << "\n";
            break;
        }

        case 4:
            std::cout << "Возврат.\n";
            break;

        default:
            std::cout << "Неверный пункт меню.\n";
            break;
        }
    }
    while (choice != 4);
}
