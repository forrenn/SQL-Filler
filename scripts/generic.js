function showSelector(sel, type='block')
{
    document.querySelector(sel).style.display = type;
}

function hideSelector(sel)
{
    document.querySelector(sel).style.display = 'none';
}

function setSelectorDisplay(sel, display)
{
    document.querySelector(sel).style.display = display;
}