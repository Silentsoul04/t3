# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |wks|

	# wks.vagrant.plugins = ["vagrant-reload"]

	wks.vm.box = "Win10"
	wks.vm.guest = :windows
	wks.vm.hostname = "workstation"
	wks.vm.provider "virtualbox" do |vb|
		vb.linked_clone = true
		vb.name = "workstation"
		vb.gui = true
		# vb.customize ["modifyvm", :id, "--ioapic", "on"]
		vb.customize ["modifyvm", :id, "--memory", "2048"]
		vb.customize ["modifyvm", :id, "--cpus", "2"]
		vb.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
	end
		
	wks.vm.synced_folder ".", 'C:\\Users\\IEUser\\Desktop\\host'
	wks.vm.communicator = "winrm"
	wks.winrm.username = "IEUser"
	wks.winrm.password = "Passw0rd!"
	
	# wks.vm.post_up_message = "You may begin...\n\n"
	wks.vm.provision "shell", privileged: true, path: "/home/water/repos/t3/workstation/scripts/provision.ps1"
	
	# wks.vm.provision "reload"
	wks.vm.provision "shell", privileged: false, inline:<<-SHELL
		iwr -useb https://www.example.com -OutFile "C:\\Users\\IEUser\\Desktop\\example.html" | Out-Null
	SHELL
end

