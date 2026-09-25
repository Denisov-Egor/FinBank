#ifndef DEPOSIT_H
#define DEPOSIT_H

#include <string>


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

#endif