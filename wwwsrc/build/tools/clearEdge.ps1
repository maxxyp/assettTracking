Get-AppXPackage -Name Microsoft.MicrosoftEdge | Foreach {
    $browserName = ($_.Name).split(".")[1];
    Write-Host $browserName
    $edge = Get-Process $browserName -ErrorAction SilentlyContinue
    $edge | Stop-Process -Force
    $dllHost = Get-Process dllhost -ErrorAction SilentlyContinue
    $dllhost | Stop-Process -Force
    sleep(5)
    Remove-Item "$env:LOCALAPPDATA\packages\$($_.PackageFamilyName)\AppData\User\Default\Indexed DB\**" 
}
