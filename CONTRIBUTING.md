# Contributing to ddiff
First off, thanks for taking the time to contribute!

Now, take a moment to be sure your contributions make sense to everyone else.
These are just guidelines, not rules.
Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct
This project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Reporting Issues
Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](https://github.com/thiamsantos/ddiff/issues).
If don't, just open a [new clear and descriptive issue](https://github.com/thiamsantos/ddiff/issues/new).

## Submitting pull requests
Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/ddiff`
- Navigate to the newly cloned directory: `cd ddiff`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `npm install`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes.

## Keeping your fork up to date

After you had make a fork you will want to keep your fork up to date with the changes that may happen in this repository (upstream).

- Configure the remote for your fork: `git remote add upstream https://github.com/thiamsantos/ddiff.git`
- Fetch the branches and their respective commits from the upstream repository: `git fetch upstream`
- Check out your fork's local master branch: `git checkout master`
- Merge the changes from upstream/master into your local master branch. This brings your fork's master branch into sync with the upstream repository, without losing your local changes: `git merge upstream/master`
