#include <iostream>
#include <vector>

#include "CreditMenu.h"

#include "../services/CreditService.h"
#include "../models/Credit.h"

void creditMenu(
    std::vector<Credit>& credits
)
{
    int choice;

    do
    {
        std::cout << R"(

    ========================
           МОИ КРЕДИТЫ
    ========================

    1. Оформить кредит
    2. Показать кредиты
    3. Выбрать кредит
    4. Вернуться

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

                createCredit(credits);

                break;

            case 2:

                displayCredits(credits);

                break;

            case 3:

                selectCredit(credits);

                break;

            case 4:

                std::cout
                    << "Возврат в главное меню.\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 4);
}
