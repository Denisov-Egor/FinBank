#ifndef MENU_H
#define MENU_H

#include <string>
#include <vector>

struct Account
{
    std::string accountNumber;
    std::string accountType;
    std::string currency;
    double balance;
    std::string status;
};

struct Operation
{
    std::string type;
    std::string accountNumber;
    double amount;
    std::string description;
};

struct Deposit
{
    std::string depositNumber;
    std::string accountNumber;
    double amount;
    std::string currency;
    double interestRate;
    int termMonths;
    std::string status;
};

extern std::vector<Account> accounts;
extern std::vector<Operation> operations;
extern std::vector<Deposit> deposits;

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

void showAccounts();
void displayAccounts();
void selectAccount();
void selectedAccountMenu(int index);
void accountMenu();

void transferMoney();
void showOperationHistory();

void createDeposit();
void displayDeposits();
void selectDeposit();
void selectedDepositMenu(int index);
void depositMenu();

void showMenu(
    const std::string& fullName,
    int age,
    const std::string& phone,
    const std::string& email
);

#endif