#ifndef TRANSFER_SERVICE_H
#define TRANSFER_SERVICE_H

#include <vector>

#include "../models/Transfer.h"

void createTransfer(
    std::vector<Transfer>& transfers
);

void displayTransfers(
    const std::vector<Transfer>& transfers
);

void selectTransfer(
    std::vector<Transfer>& transfers
);

void selectedTransferMenu(
    int index,
    std::vector<Transfer>& transfers
);

#endif
