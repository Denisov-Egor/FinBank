#ifndef ACCOUNT_SERVICE_H
#define ACCOUNT_SERVICE_H

#include <vector>

#include "../models/Account.h"
#include "../models/Operation.h"


void createAccount(
    std::vector<Account>& accounts
);


void displayAccounts(
    const std::vector<Account>& accounts
);


void selectAccount(
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
);


void selectedAccountMenu(
    int index,
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
);


#endif