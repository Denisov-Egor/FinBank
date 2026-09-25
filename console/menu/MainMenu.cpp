#include <iostream>
#include <vector>

#include "MainMenu.h"
#include "AccountMenu.h"
#include "DepositMenu.h"
#include "CreditMenu.h"
#include "TransferMenu.h"
#include "OperationMenu.h"

#include "../models/Account.h"
#include "../models/Operation.h"
#include "../models/Deposit.h"
#include "../models/Credit.h"
#include "../models/Transfer.h"

void showMenu(
    std::string fullName,
    int age,
    std::string phone,
    std::string email
)
{
    std::vector<Account> accounts;
    std::vector<Operation> operations;
    std::vector<Deposit> deposits;
    std::vector<Credit> credits;
    std::vector<Transfer> transfers;

    int choice;

    do
    {
        std::cout << R"(

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

    Выберите действие:

)";

        std::cin >> choice;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(10000, '\n');

            std::cout
                << "Ошибка: необходимо ввести число.\n";

            continue;
        }

        switch (choice)
        {
            case 1:

                std::cout
                    << "\n===== ПРОФИЛЬ =====\n";

                std::cout
                    << "ФИО: "
                    << fullName
                    << "\n";

                std::cout
                    << "Возраст: "
                    << age
                    << "\n";

                std::cout
                    << "Телефон: "
                    << phone
                    << "\n";

                std::cout
                    << "Email: "
                    << email
                    << "\n";

                break;

            case 2:

                accountMenu(
                    accounts,
                    operations
                );

                break;

            case 3:

                depositMenu(
                    deposits
                );

                break;

            case 4:

                creditMenu(
                    credits
                );

                break;

            case 5:

                transferMenu(
                    transfers
                );

                break;

            case 6:

                operationMenu(
                    operations
                );

                break;

            case 7:

                std::cout
                    << "Выход из программы\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 7);
}
