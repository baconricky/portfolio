// copy the eloqua customer GUID into a Red Hat cookie
if (typeof GetElqCustomerGUID == 'function') {
    var exp=new Date();
    exp.setTime(exp.getTime()+86400*1000*365*20); // expire in 20y
    document.cookie = 'elq_guid='+GetElqCustomerGUID()+'; expires='+exp+'; domain=redhat.com; path=/';
}
