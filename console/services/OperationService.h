#ifndef OPERATION_SERVICE_H
#define OPERATION_SERVICE_H

#include <vector>

#include "../models/Operation.h"

void displayOperations(
    const std::vector<Operation>& operations
);

void selectOperation(
    const std::vector<Operation>& operations
);

void selectedOperationMenu(
    int index,
    const std::vector<Operation>& operations
);

#endif
