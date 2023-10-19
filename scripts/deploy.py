#!/usr/bin/env python3
import json
import os


def get_template_file_content(file_name):
    with open(f"./scripts/templates/{file_name}", "r") as file:
        content = file.read()
    return content


def toString(variable):
    if type(variable) != str:
        variable = str(variable)
    return variable


def get_file_path(filename):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_directory, filename)


class Deployer:
    def __init__(self, **kwargs):
        self.initial_commands = kwargs.get("initialCommands", [])
        self.deploy_commands = kwargs.get("deployCommands", [])
        self.post_deploy_commands = kwargs.get("postDeployCommands", [])
        self.files = kwargs.get("files", {})
        self.delay = kwargs.get("delay", 0)

    def set_instances(self, instances):
        self.instances = instances

    def replace_variables(self, content, instance):
        variables = self.instances[instance]['variables']
        variables['instance'] = instance
        for variable_name in variables:
            replace = toString(variables[variable_name])
            find = '{' + variable_name + '}'
            content = content.replace(find, replace)

        return content

    def run_initial_commands(self):
        print("Running initial commands...\n")
        for command in self.initial_commands:
            print(f"\tRunning {command}")
            os.system(command)

    def run_post_deploy_commands(self):
        print("Running post-deploy commands...\n")
        for command in self.post_deploy_commands:
            os.system(command)

    def run_deploy_commands(self, instance):
        print(f"\tRunning deploy commands for {instance}...")
        for command in self.deploy_commands:
            command = self.replace_variables(command, instance)
            print(f"\t\tRunning {command}")
            os.system(command)

    def deploy(self, selected_instances):
        print("Deploying...\n")
        last_instance = selected_instances[-1]

        for instance in selected_instances:
            print(f"Deploying {instance}...")
            self.generateFiles(instance)
            self.run_deploy_commands(instance)

            if instance != last_instance:
                print(f"Waiting {self.delay} seconds...")
                os.system(f"sleep {self.delay}")

    def generateFiles(self, instance):
        print(f"\tGenerating files for {instance}...")
        for file_name in self.files:
            file = self.files[file_name]
            content = get_template_file_content(file_name)
            content = self.replace_variables(content, instance)
            to_path = self.replace_variables(file['toPath'], instance)
            with open(to_path, "w") as file:
                file.write(content)
                print(f"\t\tGenerated {to_path}")


def list_instances(instances):
    print("Available instances:")
    for i, instance_name in enumerate(instances.keys()):
        print(f"{i + 1}. {instance_name}")
    print()


def select_instances(instances):
    list_instances(instances)
    selected_indices = input("Select instance(s) by number (comma-separated), or 'all' for all instances: ")
    if selected_indices.lower() == 'all' or selected_indices == '':
        return list(instances.keys())
    else:
        indices = [int(index.strip()) - 1 for index in selected_indices.split(',')]
        return [list(instances.keys())[index] for index in indices]


def main():
    deployer_json_path = get_file_path("deployer.json")
    with open(deployer_json_path, "r") as file:
        data = file.read()

    data = json.loads(data)
    deployer = Deployer(**data)

    with open('instances.json', "r") as file:
        instances = file.read()
    instances_data = json.loads(instances)
    deployer.set_instances(instances_data)

    selected_instances = select_instances(instances_data)
    deployer.run_initial_commands()
    deployer.deploy(selected_instances)
    deployer.run_post_deploy_commands()


if __name__ == "__main__":
    main()
