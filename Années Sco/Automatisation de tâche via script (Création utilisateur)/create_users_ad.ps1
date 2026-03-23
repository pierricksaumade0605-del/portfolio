# ============================================================
#  create_users_ad.ps1
#  Création d'utilisateurs AD depuis un CSV
#  Lancer en tant qu'Administrateur du domaine
# ============================================================

# --- CONFIG : à adapter à votre environnement ---------------
$Domain     = "dc=group4,dc=local"   # <-- à modifier
$CSVPath    = ".\users_ad.csv"            # chemin du CSV
$LogFile    = ".\creation_users.log"
# ------------------------------------------------------------

Import-Module ActiveDirectory

$users = Import-Csv -Path $CSVPath -Delimiter ","

foreach ($u in $users) {

    $UPN  = "$($u.Username)@group4.local"  
    $OUPath = "$($u.OU),$Domain"

    # Crée l'OU si elle n'existe pas
    if (-not (Get-ADOrganizationalUnit -Filter "DistinguishedName -eq '$OUPath'" -ErrorAction SilentlyContinue)) {
        New-ADOrganizationalUnit -Name ($u.OU -replace "OU=","") -Path $Domain
        Write-Host "  [OU créée] $($u.OU)" -ForegroundColor Cyan
    }

    # Crée le groupe si il n'existe pas
    if (-not (Get-ADGroup -Filter "Name -eq '$($u.Groups)'" -ErrorAction SilentlyContinue)) {
        New-ADGroup -Name $u.Groups -GroupScope Global -GroupCategory Security -Path $OUPath
        Write-Host "  [Groupe créé] $($u.Groups)" -ForegroundColor Cyan
    }

    # Vérifie si l'utilisateur existe déjà
    if (Get-ADUser -Filter "SamAccountName -eq '$($u.Username)'" -ErrorAction SilentlyContinue) {
        Write-Host "  [EXISTANT] $($u.Username) — ignoré" -ForegroundColor Yellow
        Add-Content $LogFile "[EXISTANT] $($u.Username)"
        continue
    }

    # Crée l'utilisateur
    try {
        New-ADUser `
            -SamAccountName   $u.Username `
            -UserPrincipalName $UPN `
            -Name             $u.DisplayName `
            -GivenName        $u.GivenName `
            -Surname          $u.Surname `
            -Description      $u.Description `
            -Path             $OUPath `
            -AccountPassword  (ConvertTo-SecureString $u.Password -AsPlainText -Force) `
            -Enabled          $true `
            -ChangePasswordAtLogon $true

        # Ajoute au groupe
        Add-ADGroupMember -Identity $u.Groups -Members $u.Username

        Write-Host "  [OK] $($u.Username) créé dans $($u.OU)" -ForegroundColor Green
        Add-Content $LogFile "[OK] $($u.Username)"

    } catch {
        Write-Host "  [ERREUR] $($u.Username) : $_" -ForegroundColor Red
        Add-Content $LogFile "[ERREUR] $($u.Username) : $_"
    }
}

Write-Host "`n=== Terminé. Voir $LogFile pour le détail ===" -ForegroundColor White
