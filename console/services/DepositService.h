#ifndef DEPOSIT_SERVICE_H
#define DEPOSIT_SERVICE_H

#include <vector>

#include "../models/Deposit.h"

void createDeposit(
    std::vector<Deposit>& deposits
);


void displayDeposits(
    const std::vector<Deposit>& deposits
);


void selectDeposit(
    std::vector<Deposit>& deposits
);


void selectedDepositMenu(
    int index,
    std::vector<Deposit>& deposits
);


#endif