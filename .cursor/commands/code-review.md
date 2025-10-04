# Code Review Instructions

This document outlines the key areas to focus on during code reviews to ensure quality, maintainability, and user experience.

## Data Flow Analysis
- Think through how data flows in the app
- Explain new patterns if they exist and why they were chosen
- Verify data consistency and proper state management

## Infrastructure Considerations
- Were there any changes that could affect Infrastructure?
- Consider deployment, scaling, and resource usage implications
- Review configuration changes and environment variables

## User Experience States
- Consider empty states - what does the user see when there's no data?
- Review loading states - are users informed when operations are in progress?
- Check error states - are errors handled gracefully with helpful messages?
- Verify offline states - does the app work without internet connectivity?

## Frontend Accessibility Review
- Review frontend changes for accessibility (a11y):
  - Keyboard navigation - can users navigate without a mouse?
  - Focus management - is focus properly managed during interactions?
  - ARIA roles - are semantic roles correctly applied?
  - Color contrast - do colors meet WCAG guidelines?

## API Compatibility
- If public APIs have changed, ensure backwards compatibility
- Consider incrementing API version for breaking changes
- Document any new endpoints or parameter changes

## Dependency Management
- Did we add any unnecessary dependencies?
- If there's a heavy dependency, could we inline a more minimal version?
- Review bundle size impact and loading performance

## Testing Strategy
- Did we add quality tests?
- Prefer fewer, high quality tests over many low-quality ones
- Prefer integration tests for user flows
- Ensure critical paths are covered

## Database Considerations
- Were there schema changes which could require database migration?
- Review data integrity and foreign key relationships
- Consider backup and rollback strategies

## Feature Management
- If feature flags are setup, does this change require adding a new one?
- Consider gradual rollout strategies for new features

## Internationalization (i18n)
- If i18n is setup, are the strings added localized?
- Are new routes internationalized?
- Consider right-to-left language support if applicable

## Performance Optimization
- Are there places we should use caching?
- Review for potential memory leaks or performance bottlenecks
- Consider lazy loading and code splitting opportunities

## Observability
- Are we missing critical logging on backend changes?
- Consider monitoring and alerting for new functionality
- Review error tracking and debugging capabilities

## Additional Considerations
- Code style and consistency with existing patterns
- Documentation updates for new features
- Breaking changes and migration guides
- Performance impact on existing functionality
