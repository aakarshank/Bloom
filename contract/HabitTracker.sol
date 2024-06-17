// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract HabitTracker {
    struct Habit {
        uint256 amount;
        uint256 deadline;
        bool completed;
        address payable user;
        string habit;
    }

    //mapping(address => Habit) public habits;
    mapping(address => Habit[]) public habits;


    function createHabit(string memory usrHabit, uint256 deadline) external payable {
        require(msg.value > 0, "Stake amount should be greater than zero");
        require(deadline > block.timestamp, "Deadline should be in the future");

        habits[msg.sender].push(Habit({
            amount: msg.value,
            deadline: deadline,
            completed: false,
            user: payable(msg.sender),
            habit: usrHabit
        }));

    }

    function completeHabit(uint256 index) external {
        //Habit storage habit = habits[msg.sender];
        Habit storage habit = habits[msg.sender][index];
        require(habit.amount > 0, "No habit found");
        require(block.timestamp <= habit.deadline, "Deadline has passed");
        require(!habit.completed, "Habit already completed");

        habit.completed = true;
    }

    function reclaimFunds(uint256 index) external {
        //Habit storage habit = habits[msg.sender];
        Habit storage habit = habits[msg.sender][index];
        require(habit.amount > 0, "No habit found");
        require(habit.completed, "Habit not completed");

        uint256 amount = habit.amount;
        habit.amount = 0;
        habit.user.transfer(amount);
    }


    function getHabits() external view returns (Habit[] memory) {
        return habits[msg.sender];
    }

    
}
