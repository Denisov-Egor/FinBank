#ifndef CREDIT_H
#define CREDIT_H

#include <string>

struct Credit
{
    std::string creditNumber;

    std::string accountNumber;

    double amount;

    double remainingAmount;

    double interestRate;

    int termMonths;

    std::string purpose;

    std::string status;
};

#endif