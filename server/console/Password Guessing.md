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

Web client performs login attempts with different passwords until the correct password is found. **Brute force** is trying every possible combination of letters, numbers, and special characters. A **dictionary attack** uses a custom or well-know password dictionary for guessing.

<br>

### Emulate an Adversary 

- Login with the correct username and password:

<div id="indented">
<a href="http://localhost:4444/vulnerabilities/brute/?username=admin&password=password&Login=Login" target="_blank" style="color:#088A25">http://dvwa/vulnerabilities/brute/?username=admin&password=password&Login=Login</a>
</div>

<br>

- Attempt login with incorrect password:

<div id="indented">
<a href="http://localhost:4444/vulnerabilities/brute/?username=admin&password=WRONG&Login=Login" target="_blank" style="color:#C6150A">http://dvwa/vulnerabilities/brute/?username=admin&password=WRONG&Login=Login</a>
</div>
<br>

- Generate some additional failed login events:

<div id="indented">
<form name="bwapp" target="_blank" method="get" action="http://localhost:4444/vulnerabilities/brute">
  <label for="pw" style="color:#C6150A">Enter a password:</label>
  <input type="hidden" name="username" value="admin"/>
  <input type="text" id="pw" name="password"/>
  <input type="hidden" name="Login" value="Login"/>
  <button type="submit" class="link-button" style="color:#C6150A">
    Attempt login
  </button>
</form> 
</div>
<br>

### Observe Own Activity

- Use Splunk to investigate the activity:

<div id="indented">
<a href="http://localhost:8000/en-US/app/search/search?q=search%20index%3Dmain%20sourcetype%3Daccess_combined%20host%3Ddvwa%20uri_path%3D%2Fvulnerabilities%2Fbrute%2F%0A%7C%20table%20_time%20clientip%20method%20uri_path%20uri_query%20bytes%20status%0A%7C%20sort%20-_time&display.page.search.mode=verbose&dispatch.sample_ratio=1&workload_pool=&earliest=-15m&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1596477035.2"  target="_blank" class="observe">http://splunk/en-US/app/search/search</a>
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
 
