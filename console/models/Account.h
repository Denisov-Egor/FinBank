#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

struct Account
{
    std::string accountNumber;
    std::string accountType;
    std::string currency;
    double balance;
    std::string status;
};

#endif