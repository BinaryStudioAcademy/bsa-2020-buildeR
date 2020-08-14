using System;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Shared
{
    public static class General
    {
        public static IRuleBuilderOptions<T, TProperty> WhenProp<T, TProperty>(this IRuleBuilderOptions<T, TProperty> rule, Func<T, TProperty, bool> predicate, ApplyConditionTo applyConditionTo = ApplyConditionTo.AllValidators)
        {
            return rule.Configure(config => {
                config.ApplyCondition(ctx => predicate((T)ctx.InstanceToValidate, (TProperty)ctx.PropertyValue), applyConditionTo);
            });
        }
        
        public static IRuleBuilderOptions<T, TProperty> CanBeNull<T, TProperty>(this IRuleBuilderOptions<T, TProperty> rule)
        {
            return rule.WhenProp((entity, prop) => prop != null);
        }
    }
}