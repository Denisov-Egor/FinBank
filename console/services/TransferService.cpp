#include "TransferService.h"

#include <iostream>
#include <limits>

void createTransfer(
    std::vector<Transfer>& transfers
)
{
    Transfer transfer;

    transfer.transferNumber =
        "TRF" + std::to_string(transfers.size() + 1);

    std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(),
        '\n'
    );

    std::cout << "Введите счёт отправителя: ";
    std::getline(std::cin, transfer.fromAccount);

    while (transfer.fromAccount.empty())
    {
        std::cout
            << "Ошибка: счёт отправителя не может быть пустым.\n";

        std::cout << "Введите счёт отправителя: ";
        std::getline(std::cin, transfer.fromAccount);
    }

    std::cout << "Введите счёт получателя: ";
    std::getline(std::cin, transfer.toAccount);

    while (transfer.toAccount.empty())
    {
        std::cout
            << "Ошибка: счёт получателя не может быть пустым.\n";

        std::cout << "Введите счёт получателя: ";
        std::getline(std::cin, transfer.toAccount);
    }

    while (true)
    {
        std::cout << "Введите сумму перевода: ";
        std::cin >> transfer.amount;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(),
                '\n'
            );

            std::cout
                << "Ошибка: сумма должна быть числом.\n";

            continue;
        }

        if (transfer.amount <= 0)
        {
            std::cout
                << "Ошибка: сумма перевода должна быть больше 0.\n";

            continue;
        }

        break;
    }

    std::cout << "Введите валюту: ";
    std::cin >> transfer.currency;

    while (transfer.currency.empty())
    {
        std::cout
            << "Ошибка: валюта не может быть пустой.\n";

        std::cout << "Введите валюту: ";
        std::cin >> transfer.currency;
    }

    std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(),
        '\n'
    );

    std::cout << "Введите назначение перевода: ";
    std::getline(std::cin, transfer.description);

    while (transfer.description.empty())
    {
        std::cout
            << "Ошибка: назначение перевода не может быть пустым.\n";

        std::cout << "Введите назначение перевода: ";
        std::getline(std::cin, transfer.description);
    }

    transfer.status = "Выполнен";

    transfers.push_back(transfer);

    std::cout
        << "Перевод создан.\n";
}

void displayTransfers(
    const std::vector<Transfer>& transfers
)
{
    std::cout
        << "\n===== ИСТОРИЯ ПЕРЕВОДОВ =====\n";

    if (transfers.empty())
    {
        std::cout
            << "Переводов нет.\n";

        return;
    }

    for (const Transfer& transfer : transfers)
    {
        std::cout
            << "\nНомер перевода: "
            << transfer.transferNumber
            << "\n";

        std::cout
            << "Счёт отправителя: "
            << transfer.fromAccount
            << "\n";

        std::cout
            << "Счёт получателя: "
            << transfer.toAccount
            << "\n";

        std::cout
            << "Сумма: "
            << transfer.amount
            << " "
            << transfer.currency
            << "\n";

        std::cout
            << "Назначение: "
            << transfer.description
            << "\n";

        std::cout
            << "Статус: "
            << transfer.status
            << "\n";
    }
}

void selectTransfer(
    std::vector<Transfer>& transfers
)
{
    if (transfers.empty())
    {
        std::cout
            << "Переводов нет.\n";

        return;
    }

    int choice;

    for (size_t i = 0; i < transfers.size(); i++)
    {
        std::cout
            << i + 1
            << ". "
            << transfers[i].transferNumber
            << "\n";
    }

    std::cout
        << "Выберите перевод: ";

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
        static_cast<size_t>(choice) > transfers.size()
    )
    {
        std::cout
            << "Неверный номер перевода.\n";

        return;
    }

    selectedTransferMenu(
        choice - 1,
        transfers
    );
}

void selectedTransferMenu(
    int index,
    std::vector<Transfer>& transfers
)
{
    int choice;

    do
    {
        std::cout
            << "\n===== МОЙ ПЕРЕВОД =====\n\n"
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
                    << "\n===== ИНФОРМАЦИЯ О ПЕРЕВОДЕ =====\n";

                std::cout
                    << "Номер перевода: "
                    << transfers[index].transferNumber
                    << "\n";

                std::cout
                    << "Счёт отправителя: "
                    << transfers[index].fromAccount
                    << "\n";

                std::cout
                    << "Счёт получателя: "
                    << transfers[index].toAccount
                    << "\n";

                std::cout
                    << "Сумма: "
                    << transfers[index].amount
                    << " "
                    << transfers[index].currency
                    << "\n";

                std::cout
                    << "Назначение: "
                    << transfers[index].description
                    << "\n";

                std::cout
                    << "Статус: "
                    << transfers[index].status
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
