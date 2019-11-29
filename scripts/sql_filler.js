function randomDate(start, end) 
{
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var lastId = 0;
var currRow = 0;
function sqlFillerRun()
{
    lastId = 0;
    currRow = 0;
    let tableName = document.getElementById('table-name').value;
    let rowCount = parseInt(document.getElementById('row-count').value, 10);
    let rules = document.getElementById('gen-rules').value.split('\n');

    let total = '';
    let row = '';
    for (let i = 0; i < rowCount; ++i)
    {
        row = 'INSERT INTO '+tableName+' VALUES (';
        for (let j = 0; j < rules.length; ++j)
        {
            let rule = rules[j].split(' ');
            row += getRowValue(rule);
            if (j < rules.length - 1) row+=', ';
        }
        total += row+');\n';
        ++currRow;
    }

    document.getElementById("result-memo").value = total;
}

function randomInt(low,high)
{
    let delta = high-low;
    let r = low + Math.random()*delta;
    return Math.trunc(r);
}

function randomFromArr(arr)
{
    return arr[randomInt(0,arr.length-1)];
}

function getRowValue(rule)
{
    if (rule[0] == 'int') return getInt(rule);
    if (rule[0] == 'char') return getChar(rule);
    if (rule[0] == 'date') return getDate(rule);
    if (rule[0] == 'str' || rule[0] == 'openstr') return getString(rule);
    if (rule[0] == 'js') return getJs(rule);
}

function getInt(rule)
{
    if (rule[1]=='id') 
    {
        if (rule.length > 2) return (parseInt(rule[2],10)+(lastId++)).toString();
        return (lastId++).toString();
    }
    if (rule[1]=='rand') 
    {
        let low = parseInt(rule[2],10);
        let high = parseInt(rule[3],10);
        return randomInt(low,high).toString();
    }
}

var lastGender = '';
var letters = 'abcdefghijklmnopqrstuvwxyz';
var isOpen = false;

function quotes(s)
{
    return isOpen ? s.toString() : ("'"+s+"'");
}

function getDate(rule)
{
    if (rule[1] == 'rand')
    {
        let low = new Date(rule[2]);
        let high = new Date(rule[3]);
        let date = randomDate(low,high);
        let month = date.getMonth()+1;
        let day = date.getDate();
        let s = date.getFullYear() + '-' +
            ( (month < 10) ? '0'+month : month.toString() ) + '-' +
            ( (day < 10) ? '0'+day : day.toString() );
        return quotes(s);
    }
}

function getJs(rule)
{
    var funcName = rule[1];
    var code = document.getElementById('user-js').value;
    code += '\n'+funcName+'();';
    return eval(code).toString();
}

function getString(rule)
{
    isOpen = (rule[0] == 'openstr') ? true : false;
    
    if (rule[1] == 'fixed')
    {
        return quotes(rule[2]);
    }

    if (rule[1]=='gender') 
    {
        lastGender = Math.random() > 0.5 ? 'M' : 'F';
        return quotes(lastGender);
    }

    if (rule[1] == 'name')
    {
        let r = Math.random();
        if (lastGender == 'M') return quotes(randomFromArr(maleNames));
        else return quotes(randomFromArr(femaleNames));
    }

    if (rule[1] == 'surname')
    {              
        let s = randomFromArr(unisexSurnames);
        if (lastGender == 'M') return quotes(s);
        else return quotes(s+'a');
    }

    if (rule[1] == 'rand')
    {
        let ret = '';
        for (let i = 0; i < rule[2]; ++i) ret += randomFromArr(letters);
        return quotes(ret);
    }

    if (rule[1] == 'enum')
    {
        let r = randomInt(2,rule.length-1);
        return quotes(rule[r]);
    }

}