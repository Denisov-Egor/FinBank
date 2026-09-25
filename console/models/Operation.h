#ifndef OPERATION_H
#define OPERATION_H

#include <string>

struct Operation
{
    std::string type;
    std::string accountNumber;
    double amount;
    std::string description;
};

#endif