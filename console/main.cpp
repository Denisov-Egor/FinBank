#include <iostream>
#include <string>

#include "menu.h"

int main()
{
  std::cout << "========================\n";
  std::cout << "        FINBANK\n";
  std::cout << "========================\n\n";

  std::string fullName = inputFullName();
  int age = inputAge();
  std::string phone = inputPhone();
  std::string email = inputEmail();

  showMenu(fullName, age, phone, email);
}