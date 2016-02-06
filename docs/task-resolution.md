# Generator and task resolution

Given `foo`

**Registered task `foo`**

1. Search for registered task `foo`, and
  a. if found: run task `foo`, end.
  b. if not found: procede to step 2.

**Registered generator `foo`**

2. Search for registered generator `foo`, and
  a. if found: run generator `foo`, and:
     - if task `default` exists, run task `default`, end.
     - end.
  b. if not found: procede to step 3.

**Local generator `foo`**

3. Search for locally installed generator `foo`, and
  a. if found: register and run generator `foo`, and:
     - if task `default` exists, run task `default`, end.
     - end.
  b. if not found: procede to step 4.

**Global generator `foo`**

4. Search for globally installed generator `foo`, and
  a. if found: register and run generator `foo`, and:
     - if task `default` exists, run task `default`, end.
     - end.
  b. if not found: procede to step 5.

**Registed generator `default`, task `foo`**

5. Search for registered generator `default`, and
  a. if found: run generator `default`, and:
     - if task `foo` exists, run task `foo`, end.
     - end.
  b. if not found, return