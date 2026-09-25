#include <iostream>
#include <vector>

#include "AccountMenu.h"

#include "../services/AccountService.h"
#include "../models/Account.h"
#include "../models/Operation.h"


void accountMenu(
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
)
{
    int choice;


    do
    {
        std::cout << R"(

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


        if(std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(10000, '\n');

            std::cout
            << "Ошибка: необходимо ввести число.\n";

            continue;
        }


        switch(choice)
        {

            case 1:

                createAccount(accounts);

                break;


            case 2:

                displayAccounts(accounts);

                break;


            case 3:

                selectAccount(
                    accounts,
                    operations
                );

                break;


            case 4:

                std::cout
                << "Возврат в главное меню.\n";

                break;


            default:

                std::cout
                << "Неверный пункт меню.\n";

        }


    } while(choice != 4);

}