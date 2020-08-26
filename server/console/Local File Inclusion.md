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

The web application is tricked into retrieving and rendering files on the web server that aren't meant to be shared. This can be used to view files that contain sensitive data or execute files that contain code.

<br>

### Emulate an Adversary 

- Send a normal request:

<form name="exec"  target="_blank" class="inline" method="post" action="http://localhost:4444/vulnerabilities/exec/">
  <input type="hidden" name="ip" value="1.1.1.1"/>
  <input type="hidden" name="Submit" value="Submit"/>
  <button type="submit" class="link-button" style="color:#088A25">
Send a POST request to submit 1.1.1.1

  </button>
</form> 

<br>
<br>

- Send a malicious request:

<form name="exec"  target="_blank" class="inline" method="post" action="http://localhost:4444/vulnerabilities/exec/">
  <input type="hidden" name="ip" value="1.1.1.1 && cat /etc/passwd"/>
  <input type="hidden" name="Submit" value="Submit"/>
  <button type="submit" class="link-button" style="color:#C6150A">
Send a POST request to submit 1.1.1.1 && cat /etc/passwd

  </button>
</form> 

<br>
<br>


### Observe Own Activity

- Use Splunk to investigate your own activity:

<div id="indented">
<a href="http://localhost:8000/en-US/app/search/search?q=search%20index%3Dmain%20sourcetype%3Daccess_combined%20host%3Ddvwa%20uri_path%3D%2Fvulnerabilities%2Fexec%2F%0A%7C%20table%20_time%20clientip%20method%20uri_path%20uri_query%20bytes%20status%0A%7C%20sort%20-_time&display.page.search.mode=verbose&dispatch.sample_ratio=1&workload_pool=&earliest=-15m&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1596477035.2"  target="_blank" class="observe">http://splunk/en-US/app/search/search</a>
</div>
<br>


- Start a session with the victim server:

<div id="indented">
<a href="http://localhost:9009/?cid=dvwa" target="_blank" class="observe">Logon to DVWA server</a>
</div>

<br>

### Discover New Activity

- Use Splunk to discover use of this technique:

<div id="indented">
<a href="http://localhost:8000/en-US/app/search/search?q=search%20index%3Dmain%20sourcetype%3Daccess_combined%20host%3Dclone%0A%7C%20table%20_time%20clientip%20method%20uri%20status%0A%7C%20sort%20-_time&display.page.search.mode=verbose&dispatch.sample_ratio=1&workload_pool=&earliest=-15m&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1596473325.748" target="_blank" class="hunt">http://splunk/en-US/app/search/search</a>
</div>
<br>


- Check victim server for artifacts:

<div id="indented">
<a href="http://localhost:9009/?cid=dvwa" target="_blank" class="hunt">Logon to DVWA server</a>
</div>

<br>

### Triage and Response Test

- Test yourself with the clock running:

<div id="indented">
<a href="http://localhost:7777/index.html" target="_blank" class="triage">Triage Tactics Trainer</a>
</div>
 
