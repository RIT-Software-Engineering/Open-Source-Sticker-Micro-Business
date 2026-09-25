# Java Coding Guidelines

# **Table of Contents** {#table-of-contents}

[Table of Contents](#table-of-contents)

[1\. General](#1.-general)

[2\. Java Files](#2.-java-files)

[3\. Formatting](#3.-formatting)

[3.1 Braces](#3.1-braces)

[3.2 Control-Structure Braces](#3.2-control-structure-braces)

[3.3 else, catch, and finally](#3.3-else,-catch,-and-finally)

[4\. Indentation](#4.-indentation)

[5\. Column Limit](#5.-column-limit)

[6\. Line Wrapping](#6.-line-wrapping)

[7\. Statements](#7.-statements)

[8\. Blank Lines](#8.-blank-lines)

[9\. Whitespace](#9.-whitespace)

[10\. Variable Declarations](#10.-variable-declarations)

[11\. Arrays](#11.-arrays)

[12\. Naming](#12.-naming)

[12.1 Classes](#12.1-classes)

[12.2 Methods](#12.2-methods)

[12.3 Variables](#12.3-variables)

[12.4 Constants](#12.4-constants)

[12.5 Packages](#12.5-packages)

[13\. Imports](#13.-imports)

[14\. Class Organization](#14.-class-organization)

[15\. switch](#15.-switch)

[16\. Annotations](#16.-annotations)

[17\. Comments](#17.-comments)

[18\. TODO Comments](#18.-todo-comments)

[19\. Javadocs](#19.-javadocs)

[20\. Null Safety](#20.-null-safety)

[20.1 Non-null by Default](#20.1-non-null-by-default)

[20.2 Nullable Values](#20.2-nullable-values)

[20.3 Static Analysis](#20.3-static-analysis)

[20.4 Avoid Returning null](#20.4-avoid-returning-null)

[20.5 Null Checks](#20.5-null-checks)

[20.6 Nullability at Boundaries](#20.6-nullability-at-boundaries)

[21\. Optional](#21.-optional)

[22\. Final Fields and Immutability](#22.-final-fields-and-immutability)

[23\. Exceptions](#23.-exceptions)

[24\. equals, hashCode, and toString](#24.-equals,-hashcode,-and-tostring)

[25\. Formatting Enforcement](#25.-formatting-enforcement)

[26\. Static Analysis Enforcement](#26.-static-analysis-enforcement)

[27\. TL;DR](#27.-tl;dr)

# **1\. General** {#1.-general}

This project follows the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html).

The Google Java Style Guide is the authoritative source for Java formatting, naming, organization, and style decisions. These guidelines summarize the rules most relevant to the project.

When these guidelines do not explicitly address a situation, follow the Google Java Style Guide.

Do not introduce project-specific formatting conventions that conflict with Google Java Style.

# **2\. Java Files** {#2.-java-files}

Java files must:

* Use UTF-8 encoding.

* Contain a package declaration.

* Have imports after the package declaration.

* Contain exactly one top-level class declaration.

* Use the same name as the top-level class for the .java filename.

* Try not to use wildcard imports (\*).

The standard structure is:

```java
package com.example.users;

import java.util.List;
import java.util.Optional;

public final class UserService {
  // ...
}
```

Google Java Style requires exactly one top-level class per source file and specifies the ordering of license information, package declaration, imports, and the class declaration.

# **3\. Formatting** {#3.-formatting}

## **3.1 Braces** {#3.1-braces}

Use K\&R-style braces where the opening brace is on the same line as the declaration or control structure.

Classes:

```java
public class UserService {
  // ...
}
```

Methods:

```java
public User getUser(long userId) {
  // ...
}
```

Constructors:

```java
public UserService(UserRepository repository) {
  this.repository = repository;
}
```

Interfaces:

```java
public interface UserRepository {
  User findById(long userId);
}
```

Control structures:

```java
if (user.isActive()) {
  processUser(user);
}

for (User user : users) {
  processUser(user);
}

while (hasMoreUsers()) {
  processNextUser();
}
```

Do not put opening braces on a separate line.

```java
// Incorrect
public class UserService
{
}

// Incorrect
public void processUser(User user)
{
}
```

Google Java Style explicitly specifies K\&R-style braces for non-empty blocks and block-like constructs.

## **3.2 Control-Structure Braces** {#3.2-control-structure-braces}

Always use braces for:

* if

* else

* for

* while

* do

even when the body has only one statement.

Correct:

```java
if (user.isActive()) {
  processUser(user);
}
```

Incorrect:

```java
if (user.isActive())
  processUser(user);
```

This prevents bugs caused by adding statements to an apparently single-statement block and is explicitly required by Google Java Style.

## **3.3 else, catch, and finally** {#3.3-else,-catch,-and-finally}

Keep else, catch, and finally on the same line as the preceding closing brace.

```java
if (user.isAdmin()) {
  grantAdminAccess();
} else {
  grantUserAccess();
}

try {
  processRequest();
} catch (IOException e) {
  handleError(e);
} finally {
  cleanup();
}
```

# **4\. Indentation** {#4.-indentation}

Use 2 spaces per indentation level.

Never use tabs for indentation.

```java
public class UserService {
  public User getUser(long userId) {
    if (userId <= 0) {
      throw new IllegalArgumentException("Invalid user ID");
    }
    return repository.findById(userId);
  }
}
```

Google Java Style specifies two-space indentation for each new block or block-like construct.

# **5\. Column Limit** {#5.-column-limit}

Java source code has a 100-character column limit.

Lines exceeding the limit must be wrapped according to Google's line-wrapping rules.

```java
User user = userRepository.findByOrganizationAndEmail(
    organizationId, email);
```

The 100-character limit has exceptions for package declarations and imports.

# **6\. Line Wrapping** {#6.-line-wrapping}

When wrapping a line, prefer breaking at a higher syntactic level.

Continuation lines are indented at least 4 additional spaces.

```java
private static final String MESSAGE = "This is a long message that needs to be "
    + "split across multiple lines.";
```

Do not arbitrarily align tokens with spaces merely for visual alignment.

Google considers horizontal alignment optional and never requires it.

# **7\. Statements** {#7.-statements}

Use one statement per line.

```java
User user = repository.findById(userId);
processUser(user);
```

Do not place multiple statements on the same line.

```java
// Incorrect
User user = repository.findById(userId); processUser(user);
```

# **8\. Blank Lines** {#8.-blank-lines}

Use a single blank line between consecutive class members and initializers.

```java
public class UserService {
  private final UserRepository repository;

  public UserService(UserRepository repository) {
    this.repository = repository;
  }

  public User getUser(long userId) {
    return repository.findById(userId);
  }

  public void deleteUser(long userId) {
    repository.deleteById(userId);
  }
}
```

A blank line between consecutive fields is optional when it helps create logical groups.

Multiple blank lines should not be used merely for visual spacing.

# **9\. Whitespace** {#9.-whitespace}

Follow Google's horizontal whitespace rules.

Examples:

```java
if (condition) {
}

for (User user : users) {
}

while (condition) {
}

return value + otherValue;
```

There is a space:

* Between keywords and (.

* Before {.

* Around binary and ternary operators.

* After commas.

* Between a type and its identifier.

There is no unnecessary space:

```java
object.method();
not:
object . method();
```

# **10\. Variable Declarations** {#10.-variable-declarations}

Declare one variable per declaration.

Correct:

```java
int first;
int second;
```

Incorrect:

```java
int first, second;
```

The exception is the initializer of a for loop, where multiple variables may be declared when appropriate.

Local variables should generally be declared close to where they are first used rather than all at the beginning of a method.

Prefer:

```java
public void processUser(User user) {
  validateUser(user);
  String userName = user.getName();
  sendNotification(userName);
}
```

rather than declaring every local variable at the beginning of the method.

# **11\. Arrays** {#11.-arrays}

Use Java's normal type-first array syntax.

Correct:

```java
String[] names;
```

Incorrect:

```java
String names[];
```

Array initializers may use Google's supported block-like formatting.

```java
int[] values = {
  1,
  2,
  3,
};
```

# **12\. Naming** {#12.-naming}

Use Google's naming conventions.

## **12.1 Classes** {#12.1-classes}

Use UpperCamelCase.

```java
public class UserService {
}
```

Examples:

* UserService  
* PaymentProcessor  
* HttpClient

## **12.2 Methods** {#12.2-methods}

Use lowerCamelCase.

```java
public User getUserById(long userId) {
}
```

Examples:

* getUser()  
* findUserByEmail()  
* calculateTotal()  
* processPayment()

## **12.3 Variables** {#12.3-variables}

Use lowerCamelCase.

```java
long userId;
String firstName;
UserRepository userRepository;
```

## **12.4 Constants** {#12.4-constants}

Constants use UPPER\_SNAKE\_CASE.

```java
private static final int MAX_RETRY_COUNT = 3;
```

A constant is a static final field whose contents are deeply immutable and whose methods have no detectable side effects.

Not every final field is a constant.

## **12.5 Packages** {#12.5-packages}

Package names use lowercase characters.

* com.example.users  
* com.example.users.repository  
* com.example.users.service

Do not use underscores or mixed capitalization in package names.

# **13\. Imports** {#13.-imports}

Wildcard imports are prohibited.

Incorrect:

```java
import java.util.*;
```

Correct:

```java
import java.util.List;
import java.util.Map;
import java.util.Optional;
```

Imports are ordered as:

1. Static imports.

2. Non-static imports.

There is one blank line between those groups when both exist.

Imports within each group are sorted in ASCII order.

Module imports are not used.

Google Java Style explicitly prohibits wildcard imports.

# **14\. Class Organization** {#14.-class-organization}

There is no mandatory universal ordering such as:

* fields

* constructors

* public methods

* private methods

Instead, each class should have a logical and explainable ordering.

Do not simply append every new method to the bottom of the class.

Related members should be grouped where doing so improves readability.

Overloads:

Methods with the same name must appear together without unrelated members between them.

For example:

```java
public User findUser(long userId) {
  // ...
}

public User findUser(String email) {
  // ...
}

public User findUser(UUID id) {
  // ...
}
```

Do not split overloads apart with unrelated methods.

Google explicitly requires overloads and multiple constructors to remain in contiguous groups.

# **15\. switch** {#15.-switch}

Switch blocks follow normal block indentation.

```java
switch (status) {
  case ACTIVE:
    processActive();
    break;
  case INACTIVE:
    processInactive();
    break;
  default:
    handleUnknownStatus();
    break;
}
```

Every switch must be exhaustive according to Google Java Style.

For traditional switches, a fall-through must be explicitly documented.

```java
switch (status) {
  case ACTIVE:
    processActive();
    // fall through
  case PENDING:
    processPending();
    break;
  default:
    handleUnknownStatus();
}
```

Modern switch expressions should use the new-style \-\> syntax.

```java
return switch (status) {
  case ACTIVE -> "Active";
  case INACTIVE -> "Inactive";
  default -> "Unknown";
};
```

Google's current guide requires switches to be exhaustive and requires switch expressions to use the new-style syntax.

# **16\. Annotations** {#16.-annotations}

Annotations follow Google's annotation formatting rules.

Class-level annotations appear one per line.

```java
@Deprecated
@CheckReturnValue
public final class UserService {
  // ...
}
```

Method annotations normally appear one per line.

```java
@Override
@Nullable
public User findUser(long userId) {
  // ...
}
```

A single parameterless annotation may appear on the same line as the method declaration:

```java
@Override public int hashCode() {
  return id.hashCode();
}
```

Type-use annotations appear immediately before the annotated type:

```java
final @Nullable String name;
```

# **17\. Comments** {#17.-comments}

Implementation comments should be used when they add useful information.

Do not write comments that merely repeat the code.

Avoid:

```java
// Increment the counter.
counter++;
```

Prefer:

```java
// Retry because the service may still be initializing.
retryCount++;
```

Multi-line block comments follow Google's formatting rules:

```java
/*
 * This explains why this operation is necessary.
 * The implementation should not be changed without
 * considering the external service contract.
 */
```

Do not create decorative boxes using \*, \-, or other characters.

# **18\. TODO Comments** {#18.-todo-comments}

Temporary work should use a TODO comment.

The Google format is:

```java
// TODO: bug-reference - Explain what needs to be done.
```

For example:

```java
// TODO: crbug.com/12345678 - Remove this compatibility workaround.
```

TODO comments should provide context through a bug/reference rather than assigning the work to a person or team.

# **19\. Javadocs** {#19.-javadocs}

Javadocs should be used for API documentation.

Javadocs should describe the contract and behavior that users of the API need to understand.

Example:

```java
/**
 * Finds a user by their unique identifier.
 *
 * @param userId the user's unique identifier
 * @return the user associated with {@code userId}
 * @throws UserNotFoundException if the user does not exist
 */
public User getUser(long userId) {
  // ...
}
```

Follow the Google Java Style Guide's Javadoc rules for formatting, paragraphs, @param, @return, @throws, and other tags.

# **20\. Null Safety** {#20.-null-safety}

Java itself does not have Kotlin-style nullability in its type system, so null safety must be explicitly specified across APIs using standard annotations (like JSpecify) and enforced through build-time static analysis tools like NullAway.

## **20.1 Non-null by Default** {#20.1-non-null-by-default}

By default, Java type usages are unspecified. New code should be marked as non-null by default (e.g., using @NullMarked at the package level) unless null is explicitly part of the API contract.

Prefer:

```java
public User getUser(long userId) {
  return repository.getUser(userId);
}
```

If the result may legitimately be absent, represent that explicitly:

```java
public Optional<User> findUser(long userId) {
  return repository.findUser(userId);
}
```

Do not use null as an implicit "not found" result when Optional or another explicit representation is appropriate.

## **20.2 Nullable Values** {#20.2-nullable-values}

When null is a legitimate value, its nullability must be explicitly documented or annotated using JSpecify annotations (such as @Nullable).

For example:

```java
public @Nullable User findUser(long userId) {
  // ...
}
```

The project standardizes on JSpecify annotations for nullability.

Do not mix different nullability annotation libraries arbitrarily.

## **20.3 Static Analysis** {#20.3-static-analysis}

Null-safety violations must be detected automatically.

The build should use NullAway with Error Prone (configured for Gradle or Maven) to fail compilation whenever a nullability violation or improper dereference occurs.

Nullness analysis must be part of the normal build/CI process.

New code must not introduce nullness violations.

## **20.4 Avoid Returning null** {#20.4-avoid-returning-null}

Do not return null from methods whose contract indicates a non-null result.

Prefer:

```java
public List<User> getUsers() {
  return Collections.emptyList();
}
```

rather than:

```java
public List<User> getUsers() {
  return null;
}
```

For an optionally present single object:

```java
public Optional<User> findUser(long userId) {
  return Optional.ofNullable(repository.findUser(userId));
}
```

## **20.5 Null Checks** {#20.5-null-checks}

Do not add meaningless defensive null checks when the API contract guarantees a value is non-null.

Avoid:

```java
public void processUser(User user) {
  if (user == null) {
    return;
  }
  process(user);
}
```

If a user is required, establish and enforce that contract at the API boundary.

## **20.6 Nullability at Boundaries** {#20.6-nullability-at-boundaries}

External systems may provide nullable or untrusted data.

Examples include:

* Database APIs

* HTTP APIs

* JSON deserialization

* Third-party libraries

* Reflection

* Legacy code

Validate or normalize nullable data at the boundary so the rest of the application can rely on stronger contracts.

# **21\. Optional** {#21.-optional}

Use Optional\<T\> when a method naturally represents an optionally available return value.

Prefer:

```java
public Optional<User> findUser(long userId) {
  return repository.findUser(userId);
}
```

Avoid using Optional merely as a replacement for every nullable field or parameter.

For example, do not automatically create:

```java
private Optional<User> currentUser;
```

when a non-null field, nullable field with a clear contract, or another domain representation is more appropriate.

# **22\. Final Fields and Immutability** {#22.-final-fields-and-immutability}

Prefer immutable objects and final fields where practical.

```java
public final class UserService {
  private final UserRepository repository;

  public UserService(UserRepository repository) {
    this.repository = repository;
  }
}
```

Avoid mutable state when it is not required.

Prefer constructing objects in a valid state rather than creating partially initialized objects and filling them in later.

# **23\. Exceptions** {#23.-exceptions}

Use exceptions for exceptional conditions rather than normal control flow.

Exception messages should provide useful context.

```java
throw new IllegalArgumentException(
    "User ID must be positive: " + userId);
```

Do not silently catch exceptions.

Avoid:

```java
try {
  process();
} catch (Exception e) {
}
```

If an exception must be caught, handle it appropriately or propagate it.

# **24\. equals, hashCode, and toString** {#24.-equals,-hashcode,-and-tostring}

Classes that override equals() must also correctly override hashCode().

Use @Override when overriding methods.

```java
@Override
public boolean equals(Object obj) {
  // ...
}

@Override
public int hashCode() {
  // ...
}

@Override
public String toString() {
  // ...
}
```

# **25\. Formatting Enforcement** {#25.-formatting-enforcement}

Formatting should be automated.

The project should use [google-java-format](https://github.com/google/google-java-format) as the authoritative Java formatter.

Developers should not manually maintain a separate formatting style.

CI should reject Java code that does not conform to the configured formatter.

Where possible, formatting should be applied automatically before code review.

Google's own Java Style Guide identifies google-java-format as the formatter for Google Java Style.

# **26\. Static Analysis Enforcement** {#26.-static-analysis-enforcement}

The build should enforce:

* Google Java formatting.

* Compilation with no errors.

* Null-safety rules.

* Appropriate static analysis.

* No unauthorized warning suppressions.

Warnings should not be hidden merely to make CI pass.

Any suppression should be:

3. Necessary.

4. As narrowly scoped as possible.

5. Documented when its reason is not obvious.

# **27\. TL;DR** {#27.-tl;dr}

Braces:

```java
public class Example {
  public void process() {
    if (condition) {
      doSomething();
    } else {
      doSomethingElse();
    }
    for (Item item : items) {
      process(item);
    }
  }
}
```

Indentation: 2 spaces.

Maximum line length: 100 characters.

Imports: No wildcard imports.

Variables: One variable per declaration.

Control structures: Always use braces.

Naming: 

* Classes: UpperCamelCase  
* Methods: lowerCamelCase  
* Variables: lowerCamelCase  
* Constants: UPPER\_SNAKE\_CASE,  
* Packages: lowercase

Null safety: Non-null by default. Explicitly represent nullable values. Enforce nullness statically.

Formatting: google-java-format is authoritative.
