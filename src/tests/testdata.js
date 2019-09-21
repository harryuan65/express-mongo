
function TestSheetData(val){
var testdata={
    assets:{
        cash:val,
        cfafv:val,
        fvtoci_c:val,
        ac_c:val,
        fafh:val,
        nar:val,
        ar_rp:val,
        othr:val,
        inv:val
    },
    ca:{
        fvtoci_n:val,
        ac_v:val,
        iequ:val,
        ppe:val,
        int:val,
        dta:val,
        ofia:val,
    },
    nca:val,
    ta:val,
    liab:{
        stb:val,
        ap:val,
        ap_rp:val
    },
    tca:{
        dp:val,
        ditl:val,
        ll_n:val,
        onl:val
    },
    tnl:val,
    tl:val,
    tpcse:{
    ts:val,
    apic:val,
    re:val
},
te:val
};
return testdata;
}

function TestUser(val){
    var user = {
        user_id: Math.floor(Math.random() * 100),
        user_name:`Testee${val}`,
        following_company: Math.floor(Math.random()*1000),
        model: {
            in_use:["A","B"],
            not_in_use:["C","D"]
        },
        ratio: val,
        cal_result:[0.5, true]
    }
    return user;
}
module.exports = {
    TestSheetData,
    TestUser
};