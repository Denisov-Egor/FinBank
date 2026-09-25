#include "CreditService.h"

#include <iostream>
#include <limits>

void createCredit(
    std::vector<Credit>& credits
)
{
    Credit credit;

    credit.creditNumber =
        "CRD" + std::to_string(credits.size() + 1);

    while (true)
    {
        std::cout << "Введите сумму кредита: ";
        std::cin >> credit.amount;

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

        if (credit.amount <= 0)
        {
            std::cout
                << "Ошибка: сумма кредита должна быть больше 0.\n";

            continue;
        }

        break;
    }

    while (true)
    {
        std::cout << "Введите процентную ставку: ";
        std::cin >> credit.interestRate;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(),
                '\n'
            );

            std::cout
                << "Ошибка: процентная ставка должна быть числом.\n";

            continue;
        }

        if (credit.interestRate < 0)
        {
            std::cout
                << "Ошибка: процентная ставка не может быть отрицательной.\n";

            continue;
        }

        break;
    }

    while (true)
    {
        std::cout << "Введите срок кредита в месяцах: ";
        std::cin >> credit.termMonths;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(),
                '\n'
            );

            std::cout
                << "Ошибка: срок должен быть целым числом.\n";

            continue;
        }

        if (credit.termMonths <= 0)
        {
            std::cout
                << "Ошибка: срок кредита должен быть больше 0 месяцев.\n";

            continue;
        }

        break;
    }

    std::cin.ignore(
        std::numeric_limits<std::streamsize>::max(),
        '\n'
    );

    std::cout << "Введите цель кредита: ";
    std::getline(std::cin, credit.purpose);

    while (credit.purpose.empty())
    {
        std::cout
            << "Ошибка: цель кредита не может быть пустой.\n";

        std::cout << "Введите цель кредита: ";
        std::getline(std::cin, credit.purpose);
    }

    credit.remainingAmount = credit.amount;
    credit.status = "Активен";

    credits.push_back(credit);

    std::cout
        << "Кредит оформлен.\n";
}

void displayCredits(
    const std::vector<Credit>& credits
)
{
    std::cout
        << "\n===== МОИ КРЕДИТЫ =====\n";

    if (credits.empty())
    {
        std::cout
            << "У вас нет кредитов.\n";

        return;
    }

    for (const Credit& credit : credits)
    {
        std::cout
            << "\nНомер кредита: "
            << credit.creditNumber
            << "\n";

        std::cout
            << "Сумма кредита: "
            << credit.amount
            << "\n";

        std::cout
            << "Остаток: "
            << credit.remainingAmount
            << "\n";

        std::cout
            << "Процентная ставка: "
            << credit.interestRate
            << "%\n";

        std::cout
            << "Срок: "
            << credit.termMonths
            << " мес.\n";

        std::cout
            << "Цель: "
            << credit.purpose
            << "\n";

        std::cout
            << "Статус: "
            << credit.status
            << "\n";
    }
}

void selectCredit(
    std::vector<Credit>& credits
)
{
    if (credits.empty())
    {
        std::cout
            << "У вас нет кредитов.\n";

        return;
    }

    int choice;

    for (size_t i = 0; i < credits.size(); i++)
    {
        std::cout
            << i + 1
            << ". "
            << credits[i].creditNumber
            << "\n";
    }

    std::cout
        << "Выберите кредит: ";

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
        static_cast<size_t>(choice) > credits.size()
    )
    {
        std::cout
            << "Неверный номер кредита.\n";

        return;
    }

    selectedCreditMenu(
        choice - 1,
        credits
    );
}

void selectedCreditMenu(
    int index,
    std::vector<Credit>& credits
)
{
    int choice;

    do
    {
        std::cout
            << "\n===== МОЙ КРЕДИТ =====\n\n"
            << "1. Просмотреть\n"
            << "2. Погасить\n"
            << "3. Закрыть\n"
            << "4. Назад\n\n"
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
                    << "\n===== ИНФОРМАЦИЯ О КРЕДИТЕ =====\n";

                std::cout
                    << "Номер кредита: "
                    << credits[index].creditNumber
                    << "\n";

                std::cout
                    << "Номер счёта: "
                    << credits[index].accountNumber
                    << "\n";

                std::cout
                    << "Сумма кредита: "
                    << credits[index].amount
                    << "\n";

                std::cout
                    << "Остаток: "
                    << credits[index].remainingAmount
                    << "\n";

                std::cout
                    << "Процентная ставка: "
                    << credits[index].interestRate
                    << "%\n";

                std::cout
                    << "Срок: "
                    << credits[index].termMonths
                    << " мес.\n";

                std::cout
                    << "Цель: "
                    << credits[index].purpose
                    << "\n";

                std::cout
                    << "Статус: "
                    << credits[index].status
                    << "\n";

                break;

            case 2:
            {
                if (credits[index].status == "Закрыт")
                {
                    std::cout
                        << "Кредит уже закрыт.\n";

                    break;
                }

                if (credits[index].remainingAmount <= 0)
                {
                    std::cout
                        << "Кредит уже полностью погашен.\n";

                    credits[index].status = "Закрыт";

                    break;
                }

                double payment;

                std::cout
                    << "Введите сумму погашения: ";

                std::cin >> payment;

                if (std::cin.fail())
                {
                    std::cin.clear();
                    std::cin.ignore(
                        std::numeric_limits<std::streamsize>::max(),
                        '\n'
                    );

                    std::cout
                        << "Ошибка: сумма должна быть числом.\n";

                    break;
                }

                if (payment <= 0)
                {
                    std::cout
                        << "Ошибка: сумма погашения должна быть больше 0.\n";

                    break;
                }

                if (payment > credits[index].remainingAmount)
                {
                    std::cout
                        << "Ошибка: сумма погашения больше остатка кредита.\n";

                    std::cout
                        << "Остаток: "
                        << credits[index].remainingAmount
                        << "\n";

                    break;
                }

                credits[index].remainingAmount -= payment;

                std::cout
                    << "Платёж выполнен.\n";

                std::cout
                    << "Остаток кредита: "
                    << credits[index].remainingAmount
                    << "\n";

                if (credits[index].remainingAmount == 0)
                {
                    credits[index].status = "Закрыт";

                    std::cout
                        << "Кредит полностью погашен.\n";
                }

                break;
            }

            case 3:

                if (credits[index].status == "Закрыт")
                {
                    std::cout
                        << "Кредит уже закрыт.\n";

                    break;
                }

                if (credits[index].remainingAmount > 0)
                {
                    std::cout
                        << "Нельзя закрыть кредит: имеется задолженность.\n";

                    break;
                }

                credits[index].status = "Закрыт";

                std::cout
                    << "Кредит закрыт.\n";

                break;

            case 4:

                std::cout
                    << "Возврат.\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 4);
}
