const wsuri = "ws://localhost:3088";
var ws;

const default_filter = {
    Version:  "all",
    Full:     "all",
    Empty:    "dont",
    Insta:    "all",
    TV:       "dont",
    Ping:     "dont",
    Gametype: "all",
    Name:     ""
};

function wsopen(e)
{
    //container.innerHTML = "";
    //updateFilters();

    ws.send(JSON.stringify({op:'filters', data:default_filter}));
    //ws.send("{}");
}

function wsclose(e)
{
    //container.innerHTML = "<h1>Disconnected</h1>";
    init();
}

function wsmsg(e)
{
    console.info(e.data);
}

function init()
{
    ws = new WebSocket(wsuri, "livesow");
    ws.onopen = wsopen;
    ws.onclose = wsclose;
    ws.onmessage = wsmsg;

    /*container = document.getElementById("container");
    header = document.getElementById("header");
    checkHashFilters();*/
}
