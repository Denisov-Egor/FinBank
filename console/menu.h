#ifndef MENU_H
#define MENU_H

#include <string>

std::string inputFullName();
int inputAge();
std::string inputPhone();
std::string inputEmail();

void showProfile(
  const std::string& fullName,
  int age,
  const std::string& phone,
  const std::string& email
);

void showMenu(
  const std::string& fullName,
  int age,
  const std::string& phone,
  const std::string& email
);

void showAccounts();
void accountMenu();
void displayAccounts();
void selectAccount();
void selectedAccountMenu(int index);
void transferMoney();

struct Account
{
  std::string accountNumber;
  std::string accountType;
  std::string currency;
  double balance;
  std::string status;
};

#endif