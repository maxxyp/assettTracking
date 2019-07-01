# location for the log file
$logFile = "$($env:LOCALAPPDATA)\ewb-diagnostic-launch.log"

# set up a sequence of urls to call, from most specific to the problem, to least specific
$urlsToTry =    'https://pulse.britishgas.co.uk/whoami/v1?attributes=givenname,sn,employeeid,telephonenumber&roles=d-Field-Engineer,d-Field-Admin,g-Field-Engineer,g-Field-Admin',
                'https://pulse.britishgas.co.uk/fapp/engineers/v1/referencedata/list',
                'https://pulse.britishgas.co.uk',
                'https://www.google.co.uk'

# launching a universal app isn't as simple as locating an exe and booting it.  We can
#  find it via its "name" though
$appxName = "ewb"

$alwaysTryAllUrls = $TRUE # or $FALSE to stop on the first successful response

$postEwbStartupNumberOfPolls = 10
$postEwbStartupPollDelaySeconds = 2

function Log-To-File {
    param($arg)
    Out-File -InputObject $arg -FilePath $logFile -Append -Width 1000
}

function Make-Web-Request {
    param($url)
    try {
        $start = Get-Date
        $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $ok = $TRUE
    } catch {
        $exception = $_.Exception
        $response = $exception.Response
        $ok = $FALSE
    } finally {
        $end = Get-Date
        $span = $( New-TimeSpan $start $end)

        $summary = "$(If($ok) {'SUCCEEDED'} Else {'FAILED'}) $url with code $($response.StatusCode) in $($span.TotalMilliseconds )ms from $start to $end"

        # Log info to file
        Log-To-File $(Get-Date)
        Log-To-File $summary

        if (-Not $ok) {
            Log-To-File "Exception:"
            Log-To-File $exception
        }

        Log-To-File "Response:"
        Log-To-File $response

        # the headers don't appear in full when logged out as part of $response, so explicitly log them too
        Log-To-File "Headers:"
        foreach($header in $response.Headers) {
            Log-To-File $header
        }

        Log-To-File ("=" * 100)

        # Also surface to summary to the console
        Write-Host $summary
    }
    return $ok
}

# some network adapter diagnostic info logged to screen and to file:
# see https://stackoverflow.com/questions/33283848/determining-internet-connection-using-powershell
Log-To-File $(Get-Date)
Get-NetRoute | ? DestinationPrefix -eq '0.0.0.0/0' | Get-NetIPInterface | Where ConnectionState -eq 'Connected' | Tee-Object $logFile -Append
Log-To-File ("=" * 100)
Write-Host

#Check mobility connection
&'C:\program files\Netmotion Client\tellmes.exe' --show-state | Out-File -FilePath $logFile -Append

#list current kerberos tickets
klist | Out-File -FilePath $logFile -Append

# save whoAmI url before it gets popped out of the array
$whoAmIUrl = $urlsToTry[0]

# work with an ArrayList for easier manipulation
$urls = New-Object System.Collections.ArrayList($null)
$urls.AddRange($urlsToTry)

# now loop through urls until one succeeds or we are in try all urls mode
$keepGoing = $TRUE
while (($keepGoing -Or $alwaysTryAllUrls) -And ($urls.Count -Gt 0)) {
    $url = $urls[0]
    $urls.RemoveAt(0)
    $keepGoing = -Not (Make-Web-Request -url $url)
}

# open EWB
$appx = $(get-appxpackage -name $appxName | select -expandproperty PackageFamilyName)
explorer.exe shell:AppsFolder\$appx!App

# keep hitting the whoAmI endpoint whilst EWB opens
while ($postEwbStartupNumberOfPolls -Gt 0) {
    Write-Host "Polling attempt:" $postEwbStartupNumberOfPolls $(Get-Date)
    $postEwbStartupNumberOfPolls = $postEwbStartupNumberOfPolls - 1
    Make-Web-Request -url $whoAmIUrl
    Start-Sleep -s $postEwbStartupPollDelaySeconds
}