#include <iostream>
#include <string>

#include "menu/MainMenu.h"
#include "utils/Input.h"


int main()
{

    std::cout
    << "========================\n"
    << "        FINBANK\n"
    << "========================\n\n";


    std::string fullName = inputFullName();

    int age = inputAge();

    std::string phone = inputPhone();

    std::string email = inputEmail();


    showMenu(
        fullName,
        age,
        phone,
        email
    );


    return 0;
}