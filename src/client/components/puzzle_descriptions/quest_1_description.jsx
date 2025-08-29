import react from "react";
import "../styles.css";

const Quest1Description = () => {

   return (
        <div>
        <div className="">
        <div className="description">
    <h3>Part I</h3>
    <div className="story-book">
        <div className="book"></div>
        <div className="p title">Story section</div>
        <div className="p">
            The Order has a tendency to meticulously inspect the mechanisms of my machines.
            I have a plan to exploit this inspection process to keep them busy for a while.
            The machine I'm working on will have a gazillion gears inside, which ultimately do absolutely nothing.
            The entire mechanism determining the outcome of the game will be packed into small wooden tokens used for the game.
            Before those nosy knights come up with the idea of checking this element of the game, my pouches will already be stuffed to the brim with coins!
        </div>
        <div className="p">
            The machine is essentially just ordinary wooden boards with nails driven in a specific way.
            The spaces between these nails are large enough for wooden tokens, which are dropped from the top, to move between them.
            The tokens bounce off the nails to the right or left, falling to lower and lower levels.
            The place from which the token falls and where the tokens ultimately land determines the number of coins won.
        </div>
    </div>
    <div className="p">
        <b>Each machine has its own individual nail pattern</b>, which can be very quickly changed in case of an inspection by the Order.
        Nails on each diagram are marked as <pre> * </pre>, and the rest is just empty space.
        At the top of the machine, at every odd column, there are toss slots, where the tokens are inserted.
        The slots are numbered in order from left to right: 1, 2, 3, etc.
        At the bottom of the machine, there are final slots, directly above the toss slots, numbered in the same way.
        An example diagram of the machine is shown below.
    </div>
    <div className="p">
        <pre>*.*.*.*.*
        .*.*.*.*.
        *...*.*.*
        .*.*...*.
        *.*...*..
        .*.*.*.*.
        </pre>
    </div>
    <div className="p">
        In practice, this machine has 5 slots on the top and 5 slots on the bottom and looks as follows:
    </div>
    <div className="p">
        And now my favorite part - the game tokens.
        When the falling token hits a nail, it bounces to the left or right by exactly one column on the schematic.
        At first glance, they appear to be ordinary wooden tokens, but the mechanism I embedded in them allows me to control the gameplay to a large extent.
        <b>In each token, there is a sequence of behaviours</b>, and it is this sequence, not blind fate, that determines whether the token will bounce to the left <pre> L </pre> or right <pre> R </pre> upon hitting the next nail in its path.
        It is worth adding here that if the nail is near the wall, the token can also bounce off that wall.
        This means that you can only bounce off such nails in one direction, opposite to the wall.
    </div>
    <div className="p">
        Each sequence is always prepared for the maximum number of nails that can be hit, so for some paths, not all behaviours are used.
        Here is a sample sequence of behaviours for the token: <pre> RLLRLR </pre>.
        Let's have a closer look at what happens when the token is dropped to the 5th toss slot.
    </div>
    <div className="p">
      The first behavior instruction says to bounce to the right, however, the first nail is located at the right wall, so the token bounces off the wall and falls to the left.
      The next instructions in the sequence are executed without such issues: left, left, right, after which the token reached final slot number <pre> 4 </pre>.
      The coins won with the token can be calculated as:
<pre>&nbsp;
&nbsp;Coins Won = (final slot number * 2) - toss slot number&nbsp;
&nbsp;</pre>
    
      So, the token above has won <pre> (4 * 2) - 5 = <b>3</b> </pre> coins.
    </div>
    <div className="p">
        Using the 4th toss slot with the same token looks like this:
    </div>
    <div className="p">
      and it allows to win <pre>(4 * 2) - 4 = <b>4</b> </pre> coins.
    </div>
    <div className="p">
      I need to prepare a task for the employees to ensure they understand how my invention works.
      The task will include a certain machine diagram with 9 slots, and 9 tokens given as behavior sequences <span className="your-notes-tag" title="You can copy, open, or download your notes for each part below the quest description. Remember that each part has its own notes!">(&nbsp;your&nbsp;notes&nbsp;)</span>.
      The first token should be placed in the first slot, the second in the second slot, and so on.
      The employee's task will be to <b>provide the total sum of coins won by all the tokens.</b>
    </div>
</div>

<div className="example">
    <b>Example based on the following notes:</b>

    <div className="description example-note">
        <pre className="note">*.*.*.*.*.*.*.*.*
.*.*.*.*.*.*.*.*.
*.*.*...*.*...*..
.*.*.*.*.*...*.*.
*.*.....*...*.*.*
.*.*.*.*.*.*.*.*.
*...*...*.*.*.*.*
.*.*.*.*.*.*.*.*.
*.*.*...*.*.*.*.*
.*...*...*.*.*.*.
*.*.*.*.*.*.*.*.*
.*.*.*.*.*.*.*.*.

RRRLRLRRRRRL
LLLLRLRRRRRR
RLLLLLRLRLRL
LRLLLRRRLRLR
LLRLLRLLLRRL
LRLRLLLRRRRL
LRLLLLLLRLLL
RRLLLRLLRLRR
RLLLLLRLLLRL</pre></div>

    <div className="description">
        <div className="p">
            Here is the checklist to verify the correctness of the employee's solution:
        </div>
        <div className="p">
<pre>       Token   Toss Slot   Final Slot   Coins Won
RRRLRLRRRRRL           1            3           5
LLLLRLRRRRRR           2            3           4
RLLLLLRLRLRL           3            1           0   // 2 - 3 = -1, so you win nothing
LRLLLRRRLRLR           4            3           2
LLRLLRLLLRRL           5            4           3
LRLRLLLRRRRL           6            5           4
LRLLLLLLRLLL           7            4           1
RRLLLRLLRLRR           8            7           6
RLLLLLRLLLRL           9            5           1

Total: 5 + 4 + 0 + 2 + 3 + 4 + 1 + 6 + 1 = <b>26</b>
</pre>
        </div>
    </div>
</div>

<div className="p"><b className="gold">What is the total number of coins won by all the tokens?</b></div>

</div>
</div>
        
    )
}

export default Quest1Description;