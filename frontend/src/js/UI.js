const backendURL = 'https://ethergram.tk/api';

const explorers = {
    "Ethereum": {
        "ticker": "ETH",
        "mainnet": 'https://etherscan.io/tx/',
        "testnet": 'https://ropsten.etherscan.io/tx/'
    },
    "Bitcoin": {
        "ticker": "BTC",
        "mainnet": 'https://www.blockchain.com/btc/tx/',
        "testnet": 'https://live.blockcypher.com/btc-testnet/tx/'
    },
    "xDAI": {
        "mainnet": "https://blockscout.com/poa/dai/tx/"
    }
};

function CloseAlert(arg) {
    switch (arg) {
        case 0:
            document.getElementById("Error_pop").style.display = 'none';
            break;
        case 1:
            document.getElementById("Success_pop").style.display = 'none';
            break;
        default:
            break;
    }
}

function openLoader() {
    document.getElementById('loader').style.display = 'block';
}

function closeLoader() {
    document.getElementById('loader').style.display = 'none';
}

function addError(errorText) {
    document.getElementById('container').innerHTML = ` 
    <div class="alert alert-danger col-12" id="Error_pop">
        <div class="row">
            <div class="col-10">
                <h2>Error</h2>
                <h5>${errorText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(0)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
    closeLoader();
}

function addHint(errorText) {
    document.getElementById('error').innerHTML = ` 
    <div class="alert alert-danger col-12" id="Error_pop">
        <div class="row">
            <div class="col-10">
                <h2>Error</h2>
                <h5>${errorText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(0)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
    closeLoader();
}

function addSuccess(successText) {
    document.getElementById('success').innerHTML += `
    <div class="alert alert-success col-12" id="Success_pop">
        <div class="row">
            <div class="col-10">
                <h2>Success</h2>
                <h5 style="word-wrap: break-word;">${successText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(1)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>
    `;
}


function goodLuckAndSoon(successText) {
    // CloseAlert(0);
    document.getElementById('error').innerHTML += `
    <div class="alert alert-success col-12" id="Success_pop">
        <div class="row">
            <div class="col-10">
                <h2>Success</h2>
                <h5 style="word-wrap: break-word;">${successText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(1)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>
    `;
}

const query = async (method, url, data) => {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "processData": false,
    };

    if (data) {
        settings.data = data;
        settings.headers = {
            "Content-Type": "application/json",
            // "Cache-Control": "no-cache"
        };
    }

    const result = await $.ajax(settings);
    return result;
};

function checkPwd() {
    $("input[type=password]").keyup(function(){
        var ucase = new RegExp("[A-Z]+");
        var lcase = new RegExp("[a-z]+");
        var num = new RegExp("[0-9]+");

        if($("#password1").val().length >= 8){
            $("#8char").removeClass("fa-remove");
            $("#8char").addClass("fa-check");
            $("#8char").css("color","#00A41E");
        }else{
            $("#8char").removeClass("fa-check");
            $("#8char").addClass("fa-remove");
            $("#8char").css("color","#FF0004");
        }

        if(ucase.test($("#password1").val())){
            $("#ucase").removeClass("fa-remove");
            $("#ucase").addClass("fa-check");
            $("#ucase").css("color","#00A41E");
        }else{
            $("#ucase").removeClass("fa-check");
            $("#ucase").addClass("fa-remove");
            $("#ucase").css("color","#FF0004");
        }

        if(lcase.test($("#password1").val())){
            $("#lcase").removeClass("fa-remove");
            $("#lcase").addClass("fa-check");
            $("#lcase").css("color","#00A41E");
        }else{
            $("#lcase").removeClass("fa-check");
            $("#lcase").addClass("fa-remove");
            $("#lcase").css("color","#FF0004");
        }

        if(num.test($("#password1").val())){
            $("#num").removeClass("fa-remove");
            $("#num").addClass("fa-check");
            $("#num").css("color","#00A41E");
        }else{
            $("#num").removeClass("fa-check");
            $("#num").addClass("fa-remove");
            $("#num").css("color","#FF0004");
        }

        if($("#password1").val() == $("#password2").val()){
            $("#pwmatch").removeClass("fa-remove");
            $("#pwmatch").addClass("fa-check");
            $("#pwmatch").css("color","#00A41E");
        }else{
            $("#pwmatch").removeClass("fa-check");
            $("#pwmatch").addClass("fa-remove");
            $("#pwmatch").css("color","#FF0004");
        }
    });
}

const ADDRESSES = {
  "BUFF": "0x3e50bf6703fc132a94e4baff068db2055655f11b",
  "DAI": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
  "KNC": "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"
};
