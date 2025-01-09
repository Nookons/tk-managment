import { message } from "antd";

const uniqueKeywords = [
    { keyword: 'the box could not', errorCode: 1 },
    { keyword: 'the box couldn\'t go', errorCode: 1 },
    { keyword: 'oversized box stuck', errorCode: 1 },
    { keyword: 'the cargo container was overfull', errorCode: 1 },
    { keyword: 'a box couldn’t', errorCode: 1 },
    { keyword: 'box could not go', errorCode: 1 },
    { keyword: 'oversized box stuck on shelf', errorCode: 1 },
    { keyword: 'A box couldn’t go', errorCode: 1 },
    { keyword: 'Forbidden item blocked the sensor', errorCode: 1 },

    { keyword: 'worker triggered', errorCode: 2 },
    { keyword: 'worker triggered the sensor', errorCode: 2 },
    { keyword: 'worker triggered a sensor', errorCode: 2 },
    { keyword: 'employee triggered', errorCode: 2 },
    { keyword: 'employee triggered the sensor', errorCode: 2 },
    { keyword: 'employee triggered sensor', errorCode: 2 },
    { keyword: 'the operator triggered the sensor', errorCode: 2 },
    { keyword: 'the employee accidentally snagged', errorCode: 2 },

    { keyword: 'box stuck', errorCode: 3 },
    { keyword: 'the box is stuck', errorCode: 3 },
    { keyword: 'the box is stuck in the shelf', errorCode: 3 },
    { keyword: 'tote stuck in the shelf', errorCode: 3 },
    { keyword: 'box stuck on shelf', errorCode: 3 },
    { keyword: 'the tote stuck at shelf. solution: manual move tote. .', errorCode: 3 },

    { keyword: 'an item was dropped', errorCode: 4 },
    { keyword: 'forbidden item triggered', errorCode: 4 },
    { keyword: 'item fell', errorCode: 4 },
    { keyword: 'item fell out', errorCode: 4 },
    { keyword: 'item fell on', errorCode: 4 },
    { keyword: 'item fell off', errorCode: 4 },
    { keyword: 'item fell out of box', errorCode: 4 },
    { keyword: 'an item dropped', errorCode: 4 },
    { keyword: 'box dropped', errorCode: 4 },
    { keyword: 'box fell', errorCode: 4 },
    { keyword: 'box fell off', errorCode: 4 },
    { keyword: 'Item triggered the sensors', errorCode: 4 },


    { keyword: 'Fuse of compressor is off', errorCode: 5},
    { keyword: 'A compressor fuse is off', errorCode: 5},
    { keyword: 'Fuse of the compressor is blown', errorCode: 5},

    { keyword: 'worker pressed the e', errorCode: 6 },
    { keyword: 'safe mode. the employee pressed the е-stop button', errorCode: 6 },
    { keyword: 'worker pressed emergency stop', errorCode: 6 },
    { keyword: 'worker press emergency stop', errorCode: 6 },

    { keyword: 'motor alarm', errorCode: 7 },
    { keyword: 'motor malfunction', errorCode: 7 },
    { keyword: 'motor error', errorCode: 7 },

    { keyword: 'platform collision', errorCode: 8 },
    { keyword: 'platform collision detected', errorCode: 8 },

    { keyword: 'command buffer', errorCode: 9 },

    { keyword: 'computer problem', errorCode: 10 },
    { keyword: 'Clear and check memory cache', errorCode: 10 },

    { keyword: 'box flew out', errorCode: 11 },

    { keyword: 'robot have collision', errorCode: 12 },

    { keyword: 'system problem', errorCode: 13 },
    { keyword: 'System issues', errorCode: 13 },
    { keyword: 'Vision controller restart', errorCode: 13 }
];

export function parseText(line: string) {
    const withoutWorkStation = line.replace(/WS\.?\s*=?\s*\d+\s*/i, "").trim();
    const withoutTime = withoutWorkStation.replace(/(\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?)/g, "").trim();

    console.log(withoutTime.toLowerCase());  // Debugging line

    let errorMessage = `⛔ ${withoutTime} This Error was not parsed`; // Default message

    for (let keywordObj of uniqueKeywords) {
        const keyword = keywordObj.keyword.toLowerCase();  // Convert keyword to lowercase
        const errorCode = keywordObj.errorCode;

        if (withoutTime.toLowerCase().includes(keyword)) {
            switch (errorCode) {
                case 1:
                    errorMessage = "✅ the cargo container was overfull";
                    break;
                case 2:
                    errorMessage = "✅ worker triggered the sensor";
                    break;
                case 3:
                    errorMessage = "✅ box is stuck in the shelf";
                    break;
                case 4:
                    errorMessage = "✅ item fell out of box";
                    break;
                case 5:
                    errorMessage = "✅ air compressor overload including fuse blown";
                    break;
                case 6:
                    errorMessage = "✅ worker press emergency stop";
                    break;
                case 7:
                    errorMessage = "✅ motor alarm";
                    break;
                case 8:
                    errorMessage = "✅ platform collision";
                    break;
                case 9:
                    errorMessage = "✅ command buffer";
                    break;
                case 10:
                    errorMessage = "✅ computer problem";
                    break;
                case 11:
                    errorMessage = "✅ box flew out";
                    break;
                case 12:
                    errorMessage = "✅ robot have collision";
                    break;
                case 13:
                    errorMessage = "✅ system problem";
                    break;
            }
            break;  // Stop once a match is found
        }
    }

    return errorMessage;
}
