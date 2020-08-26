<style type="text/css">
    .inline {
        display: inline;
    }
    .link-button {
        text-decoration: none;
        background: none;
        border: none;
        cursor: pointer;
        text-indent: 25px;
        color: #4078c0;
        font-family: "Segoe UI", "Helvetica Neue", Helvetica,Arial, freesans, sans-serif;
        font-size: 16px;
    }
    .link-button:focus {
        outline: none;
    }
    .link-button:active, .link-button:hover {
        text-decoration: underline;
    }
    #indented {
        text-indent:35px;
    }
    .observe {
        color: #0A17F2;
    }
    .hunt {
        color: #F56802;
    }
    .triage {
        color: #7540CB;
        font-weight: bold;
    }
</style>

A web client is able to successfully request files on the web server that aren't meant to be shared. This can be used to read or modify sensitive and critical files as well as execute code. 

<br>

### Emulate an Adversary 

- Send a normal request:

<div id="indented">
<a href="http://localhost:3333/directory_traversal_1.php?page=message.txt" target="_blank" style="color:#088A25">http://bwapp/directory_traversal_1.php?page=message.txt</a>
</div>

<br>

- Send a malicious request:

<div id="indented">
<a href="http://localhost:3333/directory_traversal_1.php?page=../../../../etc/passwd" target="_blank" style="color:#C6150A">http://bwapp/directory_traversal_1.php?page=../../../../etc/passwd</a>
</div>
<br>

## Observe Own Activity

- Use Splunk to investigate the activity:

<div id="indented">
<a href="http://localhost:8000/en-US/app/search/search?q=search%20index%3Dmain%20sourcetype%3Daccess_combined%20host%3Dbwapp%20uri_path%3D%2Fdirectory_traversal_1.php%0A%7C%20table%20_time%20clientip%20method%20uri_path%20uri_query%20bytes%20status%0A%7C%20sort%20-_time&display.page.search.mode=verbose&dispatch.sample_ratio=1&workload_pool=&earliest=-15m&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1596477035.2"  target="_blank" class="observe">http://splunk.local/en-US/app/search/search</a>
</div>
<br>


- Start a session with the victim server:

<div id="indented">
<a href="http://localhost:9009/?cid=bwapp" target="_blank" class="observe">Logon to BWAPP server</a>
</div>

<br>

## Discover New Activity

- Use Splunk to discover use of this technique:

<div id="indented">
<a href="http://localhost:8000/en-US/app/search/search?q=search%20index%3Dmain%20sourcetype%3Daccess_combined%20host%3Dclone%0A%7C%20table%20_time%20clientip%20method%20uri_path%20uri_query%20bytes%20status%0A%7C%20sort%20-_time&display.page.search.mode=verbose&dispatch.sample_ratio=1&workload_pool=&earliest=-15m&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1596477035.2"  target="_blank" class="hunt">http://splunk.local/en-US/app/search/search</a>
</div>
<br>


- Check the victim server for artifacts:

<div id="indented">
<a href="http://localhost:9009/?cid=bwapp" target="_blank" class="hunt">Logon to BWAPP server</a>
</div>
<br>


### Triage and Response Test

- Test yourself with the clock running:

<div id="indented">
<a href="http://localhost:7777/index.html" target="_blank" class="triage">Triage Tactics Trainer</a>
</div>
 
