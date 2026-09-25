#include "OperationService.h"

#include <iostream>
#include <limits>

void displayOperations(
    const std::vector<Operation>& operations
)
{
    std::cout
        << "\n===== ИСТОРИЯ ОПЕРАЦИЙ =====\n";

    if (operations.empty())
    {
        std::cout
            << "Операций нет.\n";

        return;
    }

    for (size_t i = 0; i < operations.size(); i++)
    {
        std::cout
            << "\nОперация №"
            << i + 1
            << "\n";

        std::cout
            << "Тип: "
            << operations[i].type
            << "\n";

        std::cout
            << "Номер счёта: "
            << operations[i].accountNumber
            << "\n";

        std::cout
            << "Сумма: "
            << operations[i].amount
            << "\n";

        std::cout
            << "Описание: "
            << operations[i].description
            << "\n";
    }
}

void selectOperation(
    const std::vector<Operation>& operations
)
{
    if (operations.empty())
    {
        std::cout
            << "Операций нет.\n";

        return;
    }

    int choice;

    for (size_t i = 0; i < operations.size(); i++)
    {
        std::cout
            << i + 1
            << ". "
            << operations[i].type
            << " — "
            << operations[i].amount
            << "\n";
    }

    std::cout
        << "Выберите операцию: ";

    std::cin >> choice;

    if (std::cin.fail())
    {
        std::cin.clear();
        std::cin.ignore(
            std::numeric_limits<std::streamsize>::max(),
            '\n'
        );

        std::cout
            << "Ошибка: необходимо ввести число.\n";

        return;
    }

    if (
        choice < 1 ||
        static_cast<size_t>(choice) > operations.size()
    )
    {
        std::cout
            << "Неверный номер операции.\n";

        return;
    }

    selectedOperationMenu(
        choice - 1,
        operations
    );
}

void selectedOperationMenu(
    int index,
    const std::vector<Operation>& operations
)
{
    int choice;

    do
    {
        std::cout
            << "\n===== ОПЕРАЦИЯ =====\n\n"
            << "1. Просмотреть\n"
            << "2. Назад\n\n"
            << "Выберите действие: ";

        std::cin >> choice;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(),
                '\n'
            );

            std::cout
                << "Ошибка: необходимо ввести число.\n";

            continue;
        }

        switch (choice)
        {
            case 1:

                std::cout
                    << "\n===== ИНФОРМАЦИЯ ОБ ОПЕРАЦИИ =====\n";

                std::cout
                    << "Тип: "
                    << operations[index].type
                    << "\n";

                std::cout
                    << "Номер счёта: "
                    << operations[index].accountNumber
                    << "\n";

                std::cout
                    << "Сумма: "
                    << operations[index].amount
                    << "\n";

                std::cout
                    << "Описание: "
                    << operations[index].description
                    << "\n";

                break;

            case 2:

                std::cout
                    << "Возврат.\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 2);
}
