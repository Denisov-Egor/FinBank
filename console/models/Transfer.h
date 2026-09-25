#ifndef TRANSFER_H
#define TRANSFER_H

#include <string>

struct Transfer
{
    std::string transferNumber;
    std::string fromAccount;
    std::string toAccount;

    double amount;

    std::string currency;
    std::string description;
    std::string status;
};

#endif
