#ifndef CREDIT_SERVICE_H
#define CREDIT_SERVICE_H

#include <vector>

#include "../models/Credit.h"

void createCredit(
    std::vector<Credit>& credits
);

void displayCredits(
    const std::vector<Credit>& credits
);

void selectCredit(
    std::vector<Credit>& credits
);

void selectedCreditMenu(
    int index,
    std::vector<Credit>& credits
);

#endif
