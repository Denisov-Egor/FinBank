#ifndef ACCOUNTMENU_H
#define ACCOUNTMENU_H

#include <vector>

#include "../models/Account.h"
#include "../models/Operation.h"


void accountMenu(
    std::vector<Account>& accounts,
    std::vector<Operation>& operations
);


#endif