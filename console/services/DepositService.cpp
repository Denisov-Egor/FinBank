#include "DepositService.h"

#include <iostream>
#include <limits>


void createDeposit(
    std::vector<Deposit>& deposits
)
{
    Deposit deposit;

    deposit.depositNumber =
        "DEP" + std::to_string(deposits.size() + 1);

    while (true)
    {
        std::cout << "Введите сумму вклада: ";
        std::cin >> deposit.amount;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(
                std::numeric_limits<std::streamsize>::max(),
                '\n'
            );

            std::cout << "Ошибка: сумма должна быть числом.\n";
            continue;
        }

        if (deposit.amount <= 0)
        {
            std::cout
                << "Ошибка: сумма вклада должна быть больше 0.\n";
            continue;
        }

        break;
    }

    std::cout << "Введите валюту: ";
    std::cin >> deposit.currency;

    while (true)
    {
        std::cout << "Введите процентную ставку: ";
        std::cin >> deposit.interestRate;

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

        if (deposit.interestRate < 0)
        {
            std::cout
                << "Ошибка: процентная ставка не может быть отрицательной.\n";
            continue;
        }

        break;
    }

    while (true)
    {
        std::cout << "Введите срок вклада в месяцах: ";
        std::cin >> deposit.termMonths;

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

        if (deposit.termMonths <= 0)
        {
            std::cout
                << "Ошибка: срок вклада должен быть больше 0 месяцев.\n";
            continue;
        }

        break;
    }

    deposit.status = "Активен";

    deposits.push_back(deposit);

    std::cout << "Вклад создан.\n";
}


void displayDeposits(
    const std::vector<Deposit>& deposits
)
{

    if(deposits.empty())
    {
        std::cout<<"Нет вкладов\n";
        return;
    }


    for(auto& d:deposits)
    {
        std::cout<<"\nНомер: "
        <<d.depositNumber<<"\n";


        std::cout<<"Сумма: "
        <<d.amount<<" "
        <<d.currency<<"\n";


        std::cout<<"Ставка: "
        <<d.interestRate<<"%\n";


        std::cout<<"Статус: "
        <<d.status<<"\n";
    }

}



void selectDeposit(
    std::vector<Deposit>& deposits
)
{

    if(deposits.empty())
    {
        std::cout<<"Нет вкладов\n";
        return;
    }


    int choice;


    for(size_t i=0;i<deposits.size();i++)
    {
        std::cout
        <<i+1<<". "
        <<deposits[i].depositNumber
        <<"\n";
    }


    std::cout<<"Выберите вклад: ";
    std::cin>>choice;


    if(choice<1 ||
       choice>deposits.size())
    {
        return;
    }


    selectedDepositMenu(
        choice-1,
        deposits
    );

}




void selectedDepositMenu(
    int index,
    std::vector<Deposit>& deposits
)
{
    int choice;

    do
    {
        std::cout
            << "\n1. Просмотреть\n"
            << "2. Закрыть\n"
            << "3. Назад\n";

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
                    << "\n===== ИНФОРМАЦИЯ О ВКЛАДЕ =====\n";

                std::cout
                    << "Номер вклада: "
                    << deposits[index].depositNumber
                    << "\n";

                std::cout
                    << "Номер счёта: "
                    << deposits[index].accountNumber
                    << "\n";

                std::cout
                    << "Сумма: "
                    << deposits[index].amount
                    << "\n";

                std::cout
                    << "Валюта: "
                    << deposits[index].currency
                    << "\n";

                std::cout
                    << "Процентная ставка: "
                    << deposits[index].interestRate
                    << "%\n";

                std::cout
                    << "Срок: "
                    << deposits[index].termMonths
                    << " мес.\n";

                std::cout
                    << "Статус: "
                    << deposits[index].status
                    << "\n";

                break;

            case 2:

                if (deposits[index].status == "Закрыт")
                {
                    std::cout
                        << "Уже закрыт.\n";

                    break;
                }

                deposits[index].status = "Закрыт";

                std::cout
                    << "Вклад закрыт.\n";

                break;

            case 3:

                std::cout
                    << "Возврат.\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 3);
}
