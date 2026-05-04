# firewall-rdp.ps1
# Restricts RDP (Port 3389) to Local Subnet only for better security

$RuleName = "Remote Desktop - User Mode (TCP-In)"

Write-Host "Configuring Firewall to restrict RDP to Local Network..." -ForegroundColor Cyan

try {
    # Check if the rule exists
    $rule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction Stop
    
    # Set the remote address to LocalSubnet
    Set-NetFirewallRule -DisplayName $RuleName -RemoteAddress LocalSubnet
    
    Write-Host "[+] Successfully restricted RDP to Local Subnet." -ForegroundColor Green
}
catch {
    Write-Host "[!] Could not find the default RDP firewall rule. Please ensure Remote Desktop is enabled in Settings." -ForegroundColor Red
}

Write-Host "`nSecurity hardening complete."
