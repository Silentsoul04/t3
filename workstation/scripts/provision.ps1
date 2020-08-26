# Enable PowerShell Module, Script Block, and Full Transcription Logging
Invoke-WebRequest -usebasicparsing "https://raw.githubusercontent.com/matthewdunwoody/PS_logging_reg/master/PS_logging.reg" -O "C:\tools\ps.reg" 2>$nul | Out-Null
reg import "c:\tools\ps.reg" 2>$nul 

# Audit Process Creation
cmd.exe /c 'auditpol /set /subcategory:"Process Creation" /success:enable' 2>$nul | Out-Null

# Include command line in Process Creation events
Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System\Audit" -Name "ProcessCreationIncludeCmdLine_Enabled" -Type DWord -Value 1 -Force 2>$nul| Out-Null

# choco 
powershell -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))";SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install processhacker -y 

# sysmon 
iwr https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml -UseBasicParsing -OutFile C:\Windows\sysmon-config.xml
choco install sysmon -y --params="-accepteula -i -n C:\Windows\sysmon-config.xml" 
sysmon -accepteula -n -i C:\Windows\sysmon-config.xml

# splunk
choco install splunk-universalforwarder --params="RECEIVING_INDEXER=10.0.2.2:9997 DEPLOYMENT_SERVER=10.0.2.2:8089 SPLUNK_PASSWORD=admin12345" -y

Add-Content -Path "C:\Program Files\SplunkUniversalForwarder\etc\system\local\inputs.conf" -Value "`n[WinEventLog://Microsoft-Windows-Sysmon/Operational]`ndisabled = 0"

Add-Content -Path "C:\Program Files\SplunkUniversalForwarder\etc\system\local\outputs.conf" -Value @"
[tcpout]
defaultGroup = default-autolb-group

[tcpout:default-autolb-group]
server = 10.0.2.2:9997

[tcpout-server://10.0.2.2:9997]"
"@

Restart-Service SplunkForwarder -Force 

# set profile 
New-Item -Path $profile -Value "cd C:\" | Out-Null

# enable auto logon 
$RegPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"
$uname = "IEUser"
$pword = "Passw0rd!"
Set-ItemProperty $RegPath "AutoAdminLogon" -Value "1" -type String | Out-Null 
Set-ItemProperty $RegPath "DefaultUsername" -Value "$uname" -type String  | Out-Null 
Set-ItemProperty $RegPath "DefaultPassword" -Value "$pword" -type String | Out-Null 

# Change Time Zone
Set-TimeZone -Id "Central Standard Time"

# Python
# Set Python3 alias
# set-alias -name python3 -value c:\Python36\python.exe
# set-alias -name pip3 -value c:\Python36\Scripts\pip.exe
# Set Python2 alias
# set-alias -name python2 -value c:\Python27\python.exe
# set-alias -name pip2 -value c:\Python27\Scripts\pip.exe
# C:\Python27\python.exe -m pip install --upgrade pip


# Disable Windows Defender
# Set-ItemProperty -Path "HKLM:\Software\Policies\Microsoft\Windows Defender" -Name "DisableAntiSpyware" -Type DWord -Value 1 
